export function handleHomepageScroll() {
    var urlsplit = document.URL.split('/');
    var path = urlsplit[urlsplit.length - 1];
    if (path === '' || path === 'temp') {
        const el = document.getElementById("menu-title");
        const menuOffset = document.getElementById("home-menu").offsetTop;
        let scroll = window.scrollY;
        if (scroll < 205) {
            el.innerHTML = "";
        } else {
            el.innerHTML = "Self Serving Skillet";
            el.style.opacity = `${(scroll - 205) / (menuOffset - 205)}`;
        }
    }
}