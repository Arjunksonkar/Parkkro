// Initialize the map and set default location
const map = L.map('map').setView([37.7749, -122.4194], 12);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marker for selected location
let selectedMarker = null;

// Handle map click event
map.on('click', function(event) {
    const { lat, lng } = event.latlng;

    // Remove existing marker
    if (selectedMarker) {
        map.removeLayer(selectedMarker);
    }

    // Add a new marker for selected location
    selectedMarker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`Selected Location: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .openPopup();

    // Store selected coordinates
    document.getElementById('destination').value = `${lat},${lng}`;
});

// Function to display parking locations
function displayMap(data) {
    // Clear previous markers (except selected location)
    map.eachLayer(layer => {
        if (layer instanceof L.Marker && layer !== selectedMarker) {
            map.removeLayer(layer);
        }
    });

    // Add new markers for parking locations
    data.forEach(parking => {
        L.marker([parking.lat, parking.lng])
            .addTo(map)
            .bindPopup(`${parking.name} - $${parking.price}/hr`);
    });

    // Center the map on the first parking location
    if (data.length > 0) {
        map.setView([data[0].lat, data[0].lng], 12);
    }
}

// Handle search button click
document.getElementById('search').addEventListener('click', function() {
    const destination = document.getElementById('destination').value;
    const [lat, lng] = destination.split(',').map(Number);

    if (!lat || !lng) {
        alert("Please select a location on the map.");
        return;
    }

    // Fetch nearby parking spots
    fetch(`http://localhost:5000/api/parking?lat=${lat}&lng=${lng}`)
        .then(response => response.json())
        .then(data => {
            displayMap(data);
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
});
