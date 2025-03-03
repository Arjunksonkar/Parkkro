document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signup-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert("Email is already registered. Please log in.");
            return;
        }

        let newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Signup successful! You can now log in.");
        window.location.href = "login.html";
    });
});
