const btnBurger = document.querySelector(".burger_toggle");
const menu = document.querySelector(".navbar_list")
let menuOpen = false;


btnBurger.addEventListener("click", function () {

    if (menu.classList.contains('navbar_list_active')) {
        menu.classList.remove('navbar_list_active');
    } else {
        menu.classList.add('navbar_list_active');
    };

    if (!menuOpen) {
        btnBurger.classList.add("open");
        menuOpen = true;
    } else {
        btnBurger.classList.remove("open");
        menuOpen = false;
    };



});