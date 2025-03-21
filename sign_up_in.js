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

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon(savedTheme === 'dark');

    themeToggleBtn.addEventListener('click', function() {
        const isDark = body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
        
        // Add animation class
        themeToggleBtn.classList.add('theme-toggle-animation');
        setTimeout(() => {
            themeToggleBtn.classList.remove('theme-toggle-animation');
        }, 500);
    });

    function updateThemeIcon(isDark) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Add video filter transition when theme changes
    const video = document.getElementById('bg-video');
    if (video) {
        if (savedTheme === 'dark') {
            video.style.filter = 'brightness(0.6) contrast(1.2)';
        } else {
            video.style.filter = 'brightness(0.9)';
        }
    }

    // Add subtle animation to form elements
    const formElements = document.querySelectorAll('input, .button, .submit-btn');
    formElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
});

// Cover animation with jQuery
$('#cover').on('click', function(e) {
    // Only toggle if clicking on the cover itself, not its children
    if (e.target === this) {
        $(this).toggleClass('active');
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease forwards;
        opacity: 0;
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .theme-toggle-animation {
        animation: rotate 0.5s ease;
    }
    
    #bg-video {
        transition: filter 0.5s ease;
    }
`;
document.head.appendChild(style);
