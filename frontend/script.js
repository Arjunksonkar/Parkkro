// // Sample user data (replace with data from your backend)
// let user = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+123 456 7890",
//     bookings: [] // Sample booking history
// };

// // Function to display user information
// function displayUserInfo() {
//     document.getElementById('userName').textContent = user.name;
//     document.getElementById('userEmail').textContent = user.email;
//     document.getElementById('userPhone').textContent = user.phone;
// }

// // Function to display booking history
// function displayBookingHistory() {
//     const historyList = document.getElementById('historyList');
//     if (user.bookings.length === 0) {
//         historyList.innerHTML = "<p>No bookings found.</p>";
//     } else {
//         historyList.innerHTML = user.bookings.map(booking => `
//             <div class="booking">
//                 <p><strong>Location:</strong> ${booking.location}</p>
//                 <p><strong>Date:</strong> ${booking.date}</p>
//                 <p><strong>Time:</strong> ${booking.time}</p>
//             </div>
//         `).join('');
//     }
// }

// // Function to handle profile editing
// function handleProfileEdit() {
//     document.getElementById('editProfileBtn').addEventListener('click', function () {
//         document.getElementById('userInfo').classList.add('hidden');
//         document.getElementById('editProfileForm').classList.remove('hidden');
//     });

//     document.getElementById('cancelEditBtn').addEventListener('click', function () {
//         document.getElementById('editProfileForm').classList.add('hidden');
//         document.getElementById('userInfo').classList.remove('hidden');
//     });

//     document.getElementById('profileForm').addEventListener('submit', function (event) {
//         event.preventDefault();
//         const name = document.getElementById('name').value;
//         const email = document.getElementById('email').value;
//         const phone = document.getElementById('phone').value;

//         // Update user data
//         user.name = name;
//         user.email = email;
//         user.phone = phone;

//         // Display updated user info
//         displayUserInfo();

//         // Hide the edit form
//         document.getElementById('editProfileForm').classList.add('hidden');
//         document.getElementById('userInfo').classList.remove('hidden');
//     });
// }

// // Function to handle logout
// function handleLogout() {
//     document.getElementById('logoutBtn').addEventListener('click', function () {
//         alert('You have been logged out.');
//         // Redirect to the home page or login page
//         window.location.href = 'index.html';
//     });
// }

// // Function to handle search form submission
// function handleSearchForm() {
//     document.getElementById('searchForm').addEventListener('submit', function (event) {
//         event.preventDefault();

//         const location = document.getElementById('location').value;
//         const date = document.getElementById('date').value;
//         const time = document.getElementById('time').value;

//         // Here you would typically make an API call to fetch parking spots based on the input
//         // For demonstration, we'll just log the values
//         console.log(`Searching for parking in ${location} on ${date} at ${time}`);

//         // Simulate displaying a map and available parking spots
//         document.getElementById('map').innerHTML = `<p>Displaying parking spots in ${location} on ${date} at ${time}.</p>`;

//         // Simulate adding a booking to the user's booking history
//         const newBooking = { location, date, time };
//         user.bookings.push(newBooking);

//         // Update the booking history display
//         displayBookingHistory();
//     });
// }

// // Initialize the page
// function initPage() {
//     displayUserInfo();
//     displayBookingHistory();
//     handleProfileEdit();
//     handleLogout();
//     handleSearchForm();
// }

// // Run the initialization function when the page loads
// document.addEventListener('DOMContentLoaded', initPage);
// // Example endpoint to handle parking spot search
// app.post('/api/search', (req, res) => {
//     const { pickupLocation, parkingLocation, date, time } = req.body;
//     console.log('Search request:', { pickupLocation, parkingLocation, date, time });

//     // Simulate a response
//     res.json({
//         success: true,
//         message: 'Search successful',
//         data: [
//             { id: 1, location: 'Parking Spot A', available: true },
//             { id: 2, location: 'Parking Spot B', available: false },
//         ],
//     });
// });
// document.getElementById('searchForm').addEventListener('submit', async function (event) {
//     event.preventDefault();

//     const pickupLocation = document.getElementById('pickupLocation').value;
//     const parkingLocation = document.getElementById('parkingLocation').value;
//     const date = document.getElementById('date').value;
//     const time = document.getElementById('time').value;

//     const response = await fetch('http://localhost:3000/api/search', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ pickupLocation, parkingLocation, date, time }),
//     });

//     const data = await response.json();
//     console.log('Search results:', data);

//     // Display results on the frontend
//     const spotList = document.getElementById('spotList');
//     spotList.innerHTML = data.data.map(spot => `
//         <li>${spot.location} - ${spot.available ? 'Available' : 'Unavailable'}</li>
//     `).join('');
// });
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/parkaro', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
// });
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     phone: String,
//     bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
// });

// const User = mongoose.model('User', userSchema);
// document.getElementById("booking-form").addEventListener("submit", function(event) {
//     event.preventDefault();

//     let location = document.getElementById("location").value;
//     let date = document.getElementById("date").value;
//     let time = document.getElementById("time").value;
//     let duration = document.getElementById("duration").value;

//     alert(`Booking at ${location} on ${date} at ${time} for ${duration} hours`);
// });
// Initialize Map
// Initialize Map
var map = L.map('map').setView([28.6139, 77.2090], 12); // Default: New Delhi

// Add OpenStreetMap Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Click to Select Location
map.on('click', function(e) {
    var lat = e.latlng.lat.toFixed(5);
    var lng = e.latlng.lng.toFixed(5);

    // Use Nominatim API to get place name
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            var placeName = data.display_name || `Lat: ${lat}, Lng: ${lng}`;

            // Update input field with place name
            document.getElementById("location").value = placeName;

            // Add Marker
            L.marker([lat, lng]).addTo(map)
                .bindPopup(placeName)
                .openPopup();
        })
        .catch(error => console.log("Error fetching location:", error));
});

// Handle Booking Form
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
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert(`Booking Confirmed!\nLocation: ${location}\nDate: ${date}\nTime: ${time}\nDuration: ${duration} hours`);
    window.location.href = "index.html"; // Redirect to homepage
});
// Function to display bookings
function displayBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let bookingList = document.getElementById("booking-list");
    bookingList.innerHTML = "";

    bookings.forEach((booking, index) => {
        let li = document.createElement("li");
        li.textContent = `📍 ${booking.location} - 📅 ${booking.date} - ⏰ ${booking.time} - ⏳ ${booking.duration} hrs`;
        bookingList.appendChild(li);
    });
}

// Clear all bookings
document.getElementById("clear-bookings").addEventListener("click", function() {
    localStorage.removeItem("bookings");
    displayBookings();
});

// Load bookings on page load
document.addEventListener("DOMContentLoaded", displayBookings);

document.addEventListener("DOMContentLoaded", function () {
    let historyList = document.getElementById("booking-history");
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    historyList.innerHTML = ""; // Clear previous content

    if (bookings.length === 0) {
        historyList.innerHTML = "<p>No booking history available.</p>";
    } else {
        bookings.forEach((booking, index) => {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${booking.location}</strong> on ${booking.date} at ${booking.time} for ${booking.duration} hours`;
            historyList.appendChild(li);
        });
    }
});



