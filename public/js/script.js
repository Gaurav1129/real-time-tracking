const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (err) => {
        console.log(err);
    },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 2500
        }
    )
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 15);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});