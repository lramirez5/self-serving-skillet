import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { getPost } from '../graphql/queries';
import { NavbarComponent } from './NavbarComponent';
import '../styles/Post.css';

export function PostComponent() {
    const { id } = useParams();

    const [post, setPost] = useState([]);

    var carouselIndex = 0;

    useEffect(() => {
        fetchPost();
        const script = document.createElement('script');

        script.src = "https://apis.google.com/js/platform.js";
        script.async = true;

        document.body.appendChild(script);
        document.getElementById("post-sub-btn").innerHTML = `<div class="g-ytsubscribe" data-channelid="UCb8xPiMtYUox6rk4ONjSCdg" data-layout="full" data-count="default"></div>`

        return () => {
            document.body.removeChild(script);
        }
        //setCarousel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        //console.log('Post is:')
        //console.log(post)
        if (post.id) {
            //console.log('Setting carousel')
            //console.log(post)
            setCarousel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post]);

    async function fetchPost() {
        const apiData = await API.graphql({ query: getPost, variables: { id: id } });
        const postFromAPI = apiData.data.getPost;
        if (postFromAPI == null) document.location.href = "/Content-Not-Found";
        if (postFromAPI.images[0] !== '') {
            for (let i = 0; i < postFromAPI.images.length; i++) {
                postFromAPI.images[i] = await Storage.get(postFromAPI.images[i]);
            }
            //const image = await Storage.get(postFromAPI.image);
            //postFromAPI.image = image;
        }
        setPost(postFromAPI);
        document.getElementById("post-desc").innerHTML = postFromAPI.description;
        //console.log(postFromAPI);
    }

    function setCarousel() {
        //console.log("Post for carousel")
        //console.log(post)
        //console.log(window.innerWidth)
        if (window.innerWidth < 800) {
            document.getElementById('carousel').style.height = '56.25vw';
        } else {
            document.getElementById('carousel').style.height = '60vh';
        }
        var media = [];
        if (post.video) {
            media.push('carousel-vid');
        }
        if (post.images && post.images[0] !== '') {
            for (let i = 0; i < post.images.length; i++) {
                media.push(`img${i}`)
            }
        }
        if (media.length === 0) {
            document.getElementById('carousel').style.height = '0vh';
            return;
        }
        //console.log("media ids:")
        //console.log(media)
        document.getElementById(media[0]).classList.add('centered')
        for (let i = 1; i < media.length; i++) {
            let elClass = i === 1 ? 'right1' : i === 2 ? 'right2' : 'right3';
            document.getElementById(media[i]).classList.add(elClass)
        }
        if (media.length > 1) {
            var dots = document.getElementById('dots')
            dots.innerHTML += `<div class="dot-arrow-left" ></div>`;
            for (let i = 0; i < media.length; i++) {
                dots.innerHTML += `<span class="dot" ></span>`;
            }
            dots.innerHTML += `<div class="dot-arrow-right" ></div>`;
            document.getElementsByClassName("dot-arrow-left")[0].addEventListener('click', () => {
                currentSlide(media, carouselIndex - 1);
            })
            document.getElementsByClassName("dot-arrow-right")[0].addEventListener('click', () => {
                currentSlide(media, carouselIndex + 1);
            })
            document.getElementById("left-shadow").addEventListener('click', () => {
                currentSlide(media, carouselIndex - 1);
            })
            document.getElementById("right-shadow").addEventListener('click', () => {
                currentSlide(media, carouselIndex + 1);
            })
            var elem = document.getElementsByClassName("dot");
            elem[0].className += " dot-active";
            for (let i = 0; i < elem.length; i++) {
                (function () {
                    elem[i].addEventListener("click", function () { currentSlide(media, i); }, false);
                }()); // immediate invocation
            }
            let touchstartX = 0;
            let touchendX = 0;

            const slider = document.getElementById('carousel');

            function handleGesture() {
                if (touchendX < touchstartX) alert('swiped left!');
                if (touchendX > touchstartX) alert('swiped right!');
            }

            slider.addEventListener('touchstart', e => {
                touchstartX = e.changedTouches[0].screenX;
            });

            slider.addEventListener('touchend', e => {
                touchendX = e.changedTouches[0].screenX;
                handleGesture();
            });

            if (media[0] === 'carousel-vid') {
                const vidslider = document.getElementById('carousel-vid');

                function handleGesture() {
                    if (touchendX < touchstartX) alert('swiped left!');
                    if (touchendX > touchstartX) alert('swiped right!');
                }

                vidslider.addEventListener('touchstart', e => {
                    touchstartX = e.changedTouches[0].screenX;
                });

                vidslider.addEventListener('touchend', e => {
                    touchendX = e.changedTouches[0].screenX;
                    handleGesture();
                });
            }
        }
        /* if (post.video) {
            document.getElementById('carousel-vid').classList.add('centered')
            if (post.images) {
                document.getElementById('img0').classList.add('right1')
                for (let i = 1; i < post.images.length; i++) {
                    document.getElementById(`img${i}`).classList.add('right2')
                }
            }
        } else if (post.images[0] !== '') {
            if (post.images[0]) {
                document.getElementById('img0').classList.add('centered')
                if (post.images[1]) {
                    document.getElementById('img1').classList.add('right1')
                    for (let i = 2; i < post.images.length; i++) {
                        document.getElementById(`img${i}`).classList.add('right2')
                    }
                }
            }
        } else {
            console.log('ELSE REACHED')
            document.getElementById('carousel').style.height = '0vh';
        } */
    }

    function currentSlide(media, index) {
        var idx;
        if (index < 0) {
            idx = media.length - 1;
        } else if (index >= media.length) {
            idx = 0;
        } else {
            idx = index;
        }
        carouselIndex = idx;
        //console.log('==========================\n=========================')
        for (let i = 0; i < media.length; i++) {
            let el = document.getElementById(media[i])
            el.classList = ""
            let offset = idx - i;
            if (offset === 0) {
                el.classList.add('centered')
            } else if (offset === 1) {
                el.classList.add('left1')
            } else if (offset === 2) {
                el.classList.add('left2')
            } else if (offset > 2) {
                el.classList.add('left3')
            } else if (offset === -1) {
                el.classList.add('right1')
            } else if (offset === -2) {
                el.classList.add('right2')
            } else if (offset < -2) {
                el.classList.add('right3')
            }
            //console.log(document.getElementById(media[i]))
        }
        var dots = document.getElementsByClassName("dot");
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" dot-active", "");
        }
        dots[idx].className += " dot-active";
    }

    return (
        <div>
            <NavbarComponent />
            <div className="post">
                <div id='carousel'>
                    {
                        post.video &&
                        <iframe
                            id="carousel-vid"
                            src={`https://www.youtube-nocookie.com/embed/${post.video}?rel=0`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" >
                        </iframe>
                    }
                    {
                        post.images && post.images[0] !== '' && post.images.map(image => {
                            var imgid = post.images.indexOf(image);
                            return (
                                <img key={image.substring(50, 250)} id={'img' + imgid} src={image} alt="Just testing." />
                            )
                        })

                    }
                    <div id="left-shadow"></div>
                    <div id="right-shadow"></div>
                </div>
                <div id="dots" style={{ textAlign: 'center', marginTop: '12px' }}></div>
                <div id="post-sub-btn"></div>
                <h1>{post.title}</h1>
                <p id="post-desc"></p>
            </div>
        </div>
    )
}


/*

                <div>
                    {
                        post.images && post.images[0] !== '' && post.images.map(image => (
                            <img key={image.substring(0, 250)} src={image} style={{ width: 400 }} alt="Just testing." />
                        ))

                    }
                </div>
                <div>
                    {
                        post.video &&
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${post.video}?rel=0`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" >
                        </iframe>
                    }
                </div>
*/