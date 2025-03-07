//profile drop down
document.addEventListener("DOMContentLoaded", function () {
    const profileBtn = document.getElementById("profile-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");

    profileBtn.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
        if (!profileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});

// for responsive header 
function toggleMenu() {
    var navList = document.querySelector('.nav-list');
    navList.classList.toggle('active');
}
