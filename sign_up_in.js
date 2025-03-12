document.addEventListener("DOMContentLoaded", function () {
    // Sign In/Up functionality
    let cover = document.getElementById("cover");
    let signUpBtn = document.querySelector(".button.sign-up");
    let signInBtn = document.querySelector(".button.sign-in");

    signUpBtn.addEventListener("click", function (e) {
        e.preventDefault();
        cover.classList.add("active");
    });

    signInBtn.addEventListener("click", function (e) {
        e.preventDefault();
        cover.classList.remove("active");
    });

    // Theme sync with localStorage
    function checkTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // Initial theme check
    checkTheme();

    // Listen for theme changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
            checkTheme();
        }
    });
});

// Cover animation
$('#cover').on('click', function() {
    $(this).toggleClass('active');
});
