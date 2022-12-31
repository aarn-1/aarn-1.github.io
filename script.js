



function fireLaser() {
    const laser = new Audio('laser.mp3');
    laser.play().then(() => null);
}

function getLocation() {
    const x = document.getElementById('location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                x.innerHTML = 'Latitude: ' + latitude + '<br>Longitude: ' + longitude + '<br>Link: ' +
                    '<a href=\"https://www.google.de/maps/@' + latitude + ',' + longitude + ',16z\">Google Maps</a>';
            },
            () => x.innerHTML = 'Geolocation not available');
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser.';
    }
}
