document.addEventListener("DOMContentLoaded", function () {
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
});
