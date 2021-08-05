export function handleHomepageScroll() {
    var urlsplit = document.URL.split('/');
    var path = urlsplit[urlsplit.length - 1];
    if (path === '' || path === 'temp') {
        const el = document.getElementById("menu-title");
        const title = document.getElementById("site-title");
        //console.log('---------------------')
        //console.log("scrollHeight: "+title.scrollHeight)
        //console.log("offsetHeight: "+title.offsetHeight)
        //console.log("offsetTop: "+title.offsetTop)
        const menuOffset = document.getElementById("home-menu").offsetTop;
        let scroll = window.scrollY;
        //console.log("scrollY: "+scroll)
        //console.log("menuOffset: "+menuOffset)
        if(scroll > title.scrollHeight + title.offsetTop) {
            el.innerHTML = "Self Serving Skillet";
            el.style.opacity = `${(scroll - title.scrollHeight - title.offsetTop) / (menuOffset - title.scrollHeight - title.offsetTop)}`;
        } else {
            el.innerHTML = "";
        }
        /*
        //console.log((scroll - 205) / (menuOffset - 205))
        if (scroll < 205) {
            el.innerHTML = "";
        } else {
            el.innerHTML = "Self Serving Skillet";
            el.style.opacity = `${(scroll - 205) / (menuOffset - 205)}`;
        }
        */
    }
}