function buildReportImage(photoSrc, description, coords, mapsUrl) {
    return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
            var maxW = 1200;
            var scale = img.width > maxW ? maxW / img.width : 1;
            var w = Math.round(img.width * scale);
            var h = Math.round(img.height * scale);
            var barH = 100;

            var c = document.createElement('canvas');
            c.width = w;
            c.height = h + barH;
            var ctx = c.getContext('2d');

            ctx.drawImage(img, 0, 0, w, h);

            ctx.fillStyle = '#198754';
            ctx.fillRect(0, h, w, barH);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillText('Fix My City \u2014 Zg\u0142oszenie usterki', 16, h + 28);

            ctx.font = '15px Arial, sans-serif';
            var desc = description || 'Brak opisu';
            if (desc.length > 70) desc = desc.substring(0, 67) + '...';
            ctx.fillText(desc, 16, h + 54);

            ctx.font = '13px Arial, sans-serif';
            ctx.fillStyle = '#ffffffcc';
            ctx.fillText('GPS: ' + coords + '  |  ' + mapsUrl, 16, h + 78);

            c.toBlob(function (blob) { resolve(blob); }, 'image/jpeg', 0.85);
        };
        img.src = photoSrc;
    });
}

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

    buildReportImage(dataUrl, description, coords, mapsUrl).then(function (blob) {
        var file = new File([blob], 'zgloszenie-fix-my-city.jpg', { type: 'image/jpeg' });

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
