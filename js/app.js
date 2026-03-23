var map;
var userLat = null;
var userLng = null;

function initMap() {
    map = L.map('map').setView([50.04, 21.99], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function getLocation() {
    var coordsDisplay = document.getElementById('coords-display');

    if (!navigator.geolocation) {
        coordsDisplay.textContent = 'Geolokalizacja nie jest obsługiwana';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            map.setView([userLat, userLng], 15);

            L.marker([userLat, userLng])
                .addTo(map)
                .bindPopup('Twoja lokalizacja')
                .openPopup();

            coordsDisplay.textContent = userLat.toFixed(5) + ', ' + userLng.toFixed(5);
        },
        function () {
            coordsDisplay.textContent = 'Nie udało się pobrać lokalizacji';
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

document.addEventListener('photoCaptured', function (e) {
    var dataUrl = e.detail.dataUrl;

    var lat = userLat || 50.04;
    var lng = userLng || 21.99;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                userLat = lat;
                userLng = lng;

                document.getElementById('coords-display').textContent = lat.toFixed(5) + ', ' + lng.toFixed(5);

                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup('<strong>Zgłoszenie usterki</strong><br><img src="' + dataUrl + '" width="150" style="border-radius:4px">')
                    .openPopup();

                map.setView([lat, lng], 16);
            },
            function () {
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup('<strong>Zgłoszenie usterki</strong><br><img src="' + dataUrl + '" width="150" style="border-radius:4px">')
                    .openPopup();
            }
        );
    }
});

initMap();
getLocation();
