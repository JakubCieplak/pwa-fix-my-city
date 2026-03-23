const video = document.getElementById('camera-preview');
const canvas = document.getElementById('photo-canvas');
const btnCapture = document.getElementById('btn-capture');
const photoDisplay = document.getElementById('photo-display');
const photoWrapper = document.getElementById('photo-preview-wrapper');
const reportSection = document.getElementById('report-section');

function initCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
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

btnCapture.addEventListener('click', capturePhoto);

initCamera();
