const video = document.getElementById('camera-preview');
const canvas = document.getElementById('photo-canvas');
const btnCapture = document.getElementById('btn-capture');
const btnShare = document.getElementById('btn-share');
const photoDisplay = document.getElementById('photo-display');
const photoWrapper = document.getElementById('photo-preview-wrapper');
const reportSection = document.getElementById('report-section');

function initCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function () {
            alert('Nie udało się uruchomić kamery. Sprawdź uprawnienia przeglądarki.');
        });
}

function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    var dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    photoDisplay.src = dataUrl;
    photoWrapper.classList.remove('d-none');
    reportSection.classList.remove('d-none');
    document.dispatchEvent(new CustomEvent('photoCaptured', { detail: { dataUrl: dataUrl } }));
}

function shareReport() {
    var dataUrl = photoDisplay.src;
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
                    url: mapsUrl,
                    files: [file]
                }).catch(function () {});
            } else if (navigator.share) {
                navigator.share({
                    title: 'Zgłoszenie usterki - Fix My City',
                    text: shareText,
                    url: mapsUrl
                }).catch(function () {});
            } else {
                alert('Udostępnianie nie jest obsługiwane w tej przeglądarce. Użyj telefonu z Androidem lub iOS.');
            }
        });
}

btnCapture.addEventListener('click', capturePhoto);
btnShare.addEventListener('click', shareReport);

initCamera();
