import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { getPost } from '../graphql/queries';
import { NavbarComponent } from './NavbarComponent';
import '../styles/Post.css';

export function PostComponent() {
    const { id } = useParams();

    const [post, setPost] = useState([]);

    useEffect(() => {
        fetchPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchPost() {
        const apiData = await API.graphql({ query: getPost, variables: { id: id } });
        const postFromAPI = apiData.data.getPost;
        if (postFromAPI == null) document.location.href = "/Content-Not-Found";
        if (postFromAPI.images[0]) {
            for (let i = 0; i < postFromAPI.images.length; i++) {
                postFromAPI.images[i] = await Storage.get(postFromAPI.images[i]);
            }
            //const image = await Storage.get(postFromAPI.image);
            //postFromAPI.image = image;
        }
        setPost(postFromAPI);
        document.getElementById("post-desc").innerHTML = postFromAPI.description;
        console.log(postFromAPI);
    }

    return (
        <div>
            <NavbarComponent />
            <div className="post">
                <h1>{post.title}</h1>
                <p id="post-desc"></p>
                <div>
                    {
                        post.video &&
                        <iframe
                            src={`https://www.youtube.com/embed/${post.video}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" >
                        </iframe>
                    }
                </div>
                <div>
                    {
                        post.images && post.images.map(image => (
                            <img key={image.substring(50, 250)} src={image} style={{ width: 400 }} alt="Just testing." />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}