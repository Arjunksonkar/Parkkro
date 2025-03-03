document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    let user = JSON.parse(localStorage.getItem("user"));
    
    if (window.location.pathname.includes("profile.html")) {
        if (!user) {
            alert("You need to log in first!");
            window.location.href = "login.html";
        } else {
            document.getElementById("user-name").textContent = user.name;
            document.getElementById("user-email").textContent = user.email;
            document.getElementById("user-phone").textContent = user.phone;
            document.getElementById("user-joined").textContent = user.joined;
        }
    }

    // Handle signup
    if (document.getElementById("signup-form")) {
        document.getElementById("signup-form").addEventListener("submit", function (event) {
            event.preventDefault();
            let name = document.getElementById("username").value;
            let email = document.getElementById("email").value;
            let phone = "Not provided";  // Optional

            let userData = { 
                name, 
                email, 
                phone, 
                joined: new Date().toLocaleDateString() 
            };

            localStorage.setItem("user", JSON.stringify(userData));
            alert("Signup successful! Redirecting to profile.");
            window.location.href = "profile.html";
        });
    }

    // Handle login
    if (document.getElementById("login-form")) {
        document.getElementById("login-form").addEventListener("submit", function (event) {
            event.preventDefault();
            let email = document.getElementById("username").value;
            let storedUser = JSON.parse(localStorage.getItem("user"));

            if (storedUser && storedUser.email === email) {
                alert("Login successful!");
                window.location.href = "profile.html";
            } else {
                alert("Invalid login credentials!");
            }
        });
    }
});

// Edit profile function
function editProfile() {
    let newName = prompt("Enter your name:");
    let newEmail = prompt("Enter your email:");
    let newPhone = prompt("Enter your phone:");

    let updatedUser = { name: newName, email: newEmail, phone: newPhone, joined: new Date().toLocaleDateString() };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    location.reload();
}
async function loginUser(email, password) {
    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "profile.html";
    } else {
        alert(data.error);
    }
}
