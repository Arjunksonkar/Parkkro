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

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');
        const submitBtn = form.querySelector('.submit-btn');

        inputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', () => {
                input.style.borderColor = '#3aa7b1';
            });

            input.addEventListener('blur', () => {
                validateInput(input);
            });

            // Live validation
            input.addEventListener('input', () => {
                validateInput(input);
                checkFormValidity(form);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (checkFormValidity(form)) {
                submitForm(form);
            }
        });
    });

    function validateInput(input) {
        let isValid = true;
        const type = input.type;
        const value = input.value.trim();

        if (value === '') {
            showError(input, 'This field is required');
            isValid = false;
        } else if (type === 'email' && !isValidEmail(value)) {
            showError(input, 'Please enter a valid email');
            isValid = false;
        } else if (type === 'password' && value.length < 6) {
            showError(input, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            showSuccess(input);
        }

        return isValid;
    }

    function showError(input, message) {
        input.style.borderColor = '#ff4444';
        input.style.backgroundColor = 'rgba(255, 68, 68, 0.05)';
        
        // Create or update error message
        let errorDiv = input.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff4444';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.textAlign = 'left';
    }

    function showSuccess(input) {
        input.style.borderColor = '#3aa7b1';
        input.style.backgroundColor = '';
        
        // Remove error message if exists
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function checkFormValidity(form) {
        const inputs = form.querySelectorAll('input');
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function submitForm(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.value;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.value = 'Processing...';
        submitBtn.style.opacity = '0.7';

        // Simulate form submission
        setTimeout(() => {
            submitBtn.value = '✓ Success!';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.value = originalText;
                submitBtn.style.opacity = '';
                submitBtn.style.backgroundColor = '';
            }, 1500);
        }, 1500);
    }

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
