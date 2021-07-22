import React, { useState, useEffect } from 'react';
//import { HeaderComponent } from './HeaderComponent';
import { Storage } from 'aws-amplify';
import '../styles/Homepage.css';
import board from '../images/sssboard.jpg';

export function HomepageComponent() {

    const [images, setImages] = useState([]);

    useEffect(() => {
        window.addEventListener('scroll', () => handleScroll());
        fetchImages();
    }, []);

    function handleScroll() {
        const el = document.getElementById("home-menu");
        let scroll = window.scrollY;
        console.log(el.offsetTop);
    }

    async function fetchImages() {
        const image1 = await Storage.get('homepage0.jpg')
        const image2 = await Storage.get('homepage1.jpg')
        //const background = await Storage.get('background0.jpg')
        //console.log(background);
        //document.body.style.backgroundImage = ;
        //document.getElementById("container").style.backgroundImage = `url(${background})`;
        setImages([image1, image2]);
        //setBackground([background]);
    }

    return (
        <div id="container">
            <div id="home-head">
                <h1>Self Serving Skillet</h1>
            </div>
            <div id="home-menu">
                <div id="logo">
                    <a href="https://www.youtube.com/channel/UCb8xPiMtYUox6rk4ONjSCdg" target="_blank" rel="noreferrer"><img src="https://yt3.ggpht.com/ytc/AAUvwngy3103R0HdhHNVoLjs9ecQwmBqPMQ7t1nF6LDA=s176-c-k-c0x00ffffff-no-rj" alt="Watch Self Serving Skillet on Youtube" /></a>
                    <span id="menu-title">
                    </span>
                </div>
                <div id="menu-main">
                    <button onClick={function () { document.location.href = document.location.href + "recipes" }}>Food</button>
                    <button onClick={function () { document.location.href = document.location.href + "drinks" }}>Drink</button>
                    <button onClick={function () { document.location.href = document.location.href + "blog" }}>Blog</button>
                </div>
                <button id="contact-btn" onClick={function () { alert("Coming Soon") }}>Contact</button>
            </div>
            <div id="content">
                <div id="subcontent1">
                    <div id="food-panel">
                        <h1>Food</h1>
                        <p><a href={document.location.href + "recipes"} >Explore recipes <i className="arrow right"></i></a></p>
                    </div>
                    <img src={images[0]} alt="Tasty food." />
                    <div id="drink-panel">
                        <h1>Drink</h1>
                        <p><a href={document.location.href + "drinks"}>Explore recipes <i className="arrow right"></i></a></p>
                    </div>
                    <img src={images[1]} alt="Delicious drink." />
                </div>
                <div id="subcontent2">
                    <img src={board} alt="A cutting board." />
                    <div id="more-panels">
                        <div id="blog-panel">
                            <h1>Blog</h1>
                            <p><a href={document.location.href + "blog"}>See updates <i className="arrow right"></i></a></p>
                        </div>
                        <div id="extras-panel">
                            <h1>Learn cooking techniques</h1>
                            <p><a href="/">Coming soon <i className="arrow right"></i></a></p>
                            <h1>See products I endorse</h1>
                            <p><a href="/">Coming soon <i className="arrow right"></i></a></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}