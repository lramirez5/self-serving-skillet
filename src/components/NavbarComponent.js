import '../styles/Navbar.css'

export function NavbarComponent() {
    return (
        <div>
            <div id="nav-menu">
                <div id="nav-logo">
                    <a href="https://www.youtube.com/channel/UCb8xPiMtYUox6rk4ONjSCdg" target="_blank" rel="noreferrer"><img src="https://yt3.ggpht.com/ytc/AAUvwngy3103R0HdhHNVoLjs9ecQwmBqPMQ7t1nF6LDA=s176-c-k-c0x00ffffff-no-rj" alt="Watch Self Serving Skillet on Youtube" /></a>
                    <div id="nav-title">Self Serving Skillet</div>
                </div>
                <div id="nav-main">
                    <button onClick={function () { document.location.href = document.location.href + "recipes" }}>Food</button>
                    <button onClick={function () { document.location.href = document.location.href + "drinks" }}>Drink</button>
                    <button onClick={function () { document.location.href = document.location.href + "blog" }}>More</button>
                </div>
                <button id="nav-contact-btn" onClick={function () { alert("Coming Soon") }}>Contact</button>
            </div>
            <div id="nav-buffer"></div>
        </div>
    )
}