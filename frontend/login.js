document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html"; // Redirect if already logged in
    }

    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let usernameOrEmail = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let validUser = users.find(user => 
            (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password
        );

        if (validUser) {
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid username/email or password!");
        }
    });
});
