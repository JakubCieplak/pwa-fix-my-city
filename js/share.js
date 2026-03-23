function shareReport() {
    var dataUrl = document.getElementById('photo-display').src;
    var coords = document.getElementById('coords-display').textContent;
    var description = document.getElementById('report-description').value.trim();

    if (!dataUrl || dataUrl === '') {
        alert('Najpierw zrób zdjęcie problemu.');
        return;
    }

    var coordsParts = coords.split(',').map(function (s) { return s.trim(); });
    var mapsUrl = 'https://www.google.com/maps?q=' + coordsParts[0] + ',' + coordsParts[1];

    var shareText = 'Zgłoszenie usterki - Fix My City\n\n';
    if (description) {
        shareText += description + '\n\n';
    }
    shareText += 'Lokalizacja GPS: ' + coords + '\nMapa: ' + mapsUrl;

    fetch(dataUrl)
        .then(function (res) { return res.blob(); })
        .then(function (blob) {
            var file = new File([blob], 'usterka.jpg', { type: 'image/jpeg' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: 'Zgłoszenie usterki - Fix My City',
                    text: shareText,
                    files: [file]
                }).catch(function () {});
            } else if (navigator.share) {
                navigator.share({
                    title: 'Zgłoszenie usterki - Fix My City',
                    text: shareText
                }).catch(function () {});
            } else {
                alert('Udostępnianie nie jest obsługiwane w tej przeglądarce. Użyj telefonu z Androidem lub iOS.');
            }
        });
}

document.getElementById('btn-share').addEventListener('click', shareReport);
