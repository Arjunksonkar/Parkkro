// Initialize Map with custom options
var map = L.map('map', {
    zoomControl: false,
    minZoom: 3,
    maxZoom: 18
}).setView([28.6139, 77.2090], 12);

// Custom zoom control
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Add OpenStreetMap Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;
let isFullscreen = false;

// Create map overlay
const mapOverlay = document.createElement('div');
mapOverlay.className = 'map-overlay';
document.body.appendChild(mapOverlay);

// Function to toggle fullscreen
function toggleFullscreen(event) {
    const mapElement = document.getElementById('map');
    
    // Don't toggle if clicking on popup or marker
    if (event && (
        event.target.classList.contains('leaflet-popup') || 
        event.target.closest('.leaflet-popup') || 
        event.target.closest('.leaflet-marker-icon')
    )) {
        return;
    }
    
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        mapElement.classList.add('fullscreen');
        mapOverlay.classList.add('active');
        setTimeout(() => {
            map.invalidateSize();
            if (marker) {
                map.setView(marker.getLatLng(), map.getZoom());
            }
        }, 300);
    } else {
        mapElement.classList.remove('fullscreen');
        mapOverlay.classList.remove('active');
        setTimeout(() => map.invalidateSize(), 300);
    }
}

// Map click handler
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(5);
    const lng = e.latlng.lng.toFixed(5);

    // Remove previous marker
    if (marker) map.removeLayer(marker);

    // Add new marker
    marker = L.marker([lat, lng]).addTo(map);

    // Fetch place details
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            const placeName = data.display_name || `Lat: ${lat}, Lng: ${lng}`;
            
            // Update form fields
            document.getElementById("location").value = placeName;
            document.getElementById("search-box").value = placeName;

            // Show simple popup with just the location name
            marker.bindPopup(`<div class="map-popup">${placeName}</div>`).openPopup();

            // Close fullscreen if marker is clicked in fullscreen mode
            marker.on('click', () => {
                if (isFullscreen) toggleFullscreen();
            });
        })
        .catch(error => console.error("Error fetching location:", error));
});

// Add click handler to map container to open fullscreen
document.getElementById('map').addEventListener('click', function(event) {
    if (!isFullscreen && !event.target.classList.contains('leaflet-popup') && 
        !event.target.closest('.leaflet-popup') && 
        !event.target.closest('.leaflet-marker-icon')) {
        toggleFullscreen();
    }
});

// Close fullscreen when clicking overlay
mapOverlay.addEventListener('click', function(event) {
    if (event.target === mapOverlay && isFullscreen) {
        toggleFullscreen();
    }
});

// Enhanced search functionality
function searchLocation() {
    const searchQuery = document.getElementById("search-box").value;
    if (!searchQuery) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const location = data[0];
                const lat = parseFloat(location.lat);
                const lon = parseFloat(location.lon);

                // Remove previous marker
                if (marker) map.removeLayer(marker);

                // Add new marker
                marker = L.marker([lat, lon]).addTo(map);
                
                // Update form fields
                document.getElementById("location").value = location.display_name;
                document.getElementById("search-box").value = location.display_name;

                // Center map on location
                map.setView([lat, lon], 16);

                // Show simple popup with just the location name
                marker.bindPopup(`<div class="map-popup">${location.display_name}</div>`).openPopup();

                // Close fullscreen if marker is clicked in fullscreen mode
                marker.on('click', () => {
                    if (isFullscreen) toggleFullscreen();
                });
            } else {
                alert("Location not found! Try a different search.");
            }
        })
        .catch(error => console.error("Error searching location:", error));
}

// Attach event listener to search button
document.getElementById("search-btn").addEventListener("click", searchLocation);

// Handle Booking Form Submission
document.getElementById("booking-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let location = document.getElementById("location").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let duration = document.getElementById("duration").value;

    if (!location) {
        alert("Please select a location on the map!");
        return;
    }

    let booking = { location, date, time, duration };

    // Save the current booking separately
    localStorage.setItem("currentBooking", JSON.stringify(booking));

    // Save in booking history
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert(`Booking Confirmed!\nLocation: ${location}\nDate: ${date}\nTime: ${time}\nDuration: ${duration} hours`);

    // Display the latest booking & history
    displayCurrentBooking();
    displayBookings();
});

// Function to display the latest booking
function displayCurrentBooking() {
    let currentBooking = JSON.parse(localStorage.getItem("currentBooking"));
    let currentBookingDiv = document.getElementById("current-booking");
    
    if (currentBooking) {
        currentBookingDiv.innerHTML = `
            <p><strong>Latest Booking:</strong></p>
            <p><strong>Location:</strong> ${currentBooking.location}</p>
            <p><strong>Date:</strong> ${currentBooking.date}</p>
            <p><strong>Time:</strong> ${currentBooking.time}</p>
            <p><strong>Duration:</strong> ${currentBooking.duration} hours</p>
        `;
    } else {
        currentBookingDiv.innerHTML = "<p>No current booking available.</p>";
    }
}

// Function to display booking history
function displayBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let historyList = document.getElementById("booking-history");
    historyList.innerHTML = "";

    if (bookings.length === 0) {
        historyList.innerHTML = "<p>No booking history available.</p>";
    } else {
        bookings.forEach((booking, index) => {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${booking.location}</strong> on ${booking.date} at ${booking.time} for ${booking.duration} hours`;
            historyList.appendChild(li);
        });
    }
}

// Clear all bookings
document.getElementById("clear-bookings").addEventListener("click", function() {
    localStorage.removeItem("bookings");
    localStorage.removeItem("currentBooking");
    displayCurrentBooking();
    displayBookings();
});

// Load bookings on page load
document.addEventListener("DOMContentLoaded", function() {
    displayCurrentBooking();
    displayBookings();
});

// Parallax Effect for Image
window.addEventListener("scroll", function() {
    let scrollPosition = window.scrollY;
    document.getElementById("parallax-image").style.transform = `translateY(${scrollPosition * 0.5}px)`;
});
document.addEventListener("DOMContentLoaded", function() {
    let historyList = document.getElementById("booking-history");
    let bookingList = document.getElementById("booking-list");
    
    let historyBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let currentBookings = JSON.parse(sessionStorage.getItem("currentBookings")) || [];

    function updateBookingLists() {
        bookingList.innerHTML = "";
        historyList.innerHTML = "";

        if (historyBookings.length === 0) {
            historyList.innerHTML = "<p>No booking history available.</p>";
        } else {
            historyBookings.forEach((booking) => {
                let li = document.createElement("li");
                li.innerHTML = `<strong>${booking.location}</strong> on ${booking.date} at ${booking.time} for ${booking.duration} hours`;
                historyList.appendChild(li);
            });
        }

        if (currentBookings.length === 0) {
            bookingList.innerHTML = "<p>No bookings yet.</p>";
        } else {
            currentBookings.forEach((booking, index) => {
                let li = document.createElement("li");
                li.innerHTML = `
                    <strong>${booking.location}</strong> on ${booking.date} at ${booking.time} for ${booking.duration} hours
                    <button class="delete-booking" data-index="${index}">❌</button>
                `;
                bookingList.appendChild(li);
            });
        }

        attachDeleteEvent();
    }

    function attachDeleteEvent() {
        document.querySelectorAll(".delete-booking").forEach(button => {
            button.addEventListener("click", function() {
                let index = this.getAttribute("data-index");
                currentBookings.splice(index, 1);
                sessionStorage.setItem("currentBookings", JSON.stringify(currentBookings));
                updateBookingLists();
            });
        });
    }

    updateBookingLists();

    // Handle New Booking Submission
    document.getElementById("booking-form").addEventListener("submit", function(event) {
        event.preventDefault();

        let location = document.getElementById("location").value;
        let date = document.getElementById("date").value;
        let time = document.getElementById("time").value;
        let duration = document.getElementById("duration").value;

        if (location && date && time && duration) {
            let newBooking = { location, date, time, duration };
            
            // Add to both history and current session
            historyBookings.push(newBooking);
            currentBookings.push(newBooking);
            
            localStorage.setItem("bookings", JSON.stringify(historyBookings)); // Save history
            sessionStorage.setItem("currentBookings", JSON.stringify(currentBookings)); // Save current bookings
            
            updateBookingLists();
            this.reset();
        } else {
            alert("Please fill all fields!");
        }
    });

    // Clear "Your Bookings" without affecting history
    document.getElementById("clear-bookings").addEventListener("click", function() {
        sessionStorage.removeItem("currentBookings");
        currentBookings = [];
        updateBookingLists();
    });

    // Clear Booking History
    document.getElementById("clear-history").addEventListener("click", function() {
        localStorage.removeItem("bookings");
        historyBookings = [];
        updateBookingLists();
    });
});
//profile drop down
document.addEventListener("DOMContentLoaded", function () {
    const profileBtn = document.getElementById("profile-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");
    let isDropdownOpen = false;

    // Toggle dropdown on click
    profileBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        isDropdownOpen = !isDropdownOpen;
        dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!profileBtn.contains(event.target) && 
            !dropdownMenu.contains(event.target) && 
            !event.target.closest('.dropdown-menu')) {
            dropdownMenu.classList.remove("show");
            isDropdownOpen = false;
        }
    });

    // Prevent dropdown from closing when clicking inside it
    dropdownMenu.addEventListener("click", function (e) {
        e.stopPropagation();
    });
});

// for responsive header 
function toggleMenu() {
    var navList = document.querySelector('.nav-list');
    navList.classList.toggle('active');
}

//parallax video effect
window.addEventListener("scroll", function() {
    let scrollPosition = window.scrollY;
    let video = document.getElementById("parallax-video");

    // Adjust video movement speed (lower factor = slower movement)
    video.style.transform = `translate(-50%, calc(-50% + ${scrollPosition * 0.5}px))`;
});

// Mute/Unmute button functionality
const muteButton = document.getElementById("mute-button");
const video = document.getElementById("parallax-video");

muteButton.addEventListener("click", function() {
    if (video.muted) {
        video.muted = false;
        muteButton.textContent = "🔊 Unmute";
    } else {
        video.muted = true;
        muteButton.textContent = "�� Mute";
    }
});

// Theme Switching
document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark-theme", currentTheme === "dark");
    updateThemeToggle(currentTheme === "dark");

    // Theme toggle click handler
    themeToggle.addEventListener("click", function(e) {
        e.preventDefault();
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeToggle(isDark);
    });

    // Update toggle button text and icon
    function updateThemeToggle(isDark) {
        const icon = themeToggle.querySelector("i");
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
        themeToggle.innerHTML = `${icon.outerHTML}${isDark ? "Light Mode" : "Dark Mode"}`;
    }
});


