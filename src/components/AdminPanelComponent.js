import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { postsByDate } from '../graphql/queries';
import { createPost as createPostMutation, deletePost as deletePostMutation } from '../graphql/mutations';
import { HeaderComponent } from './HeaderComponent';
import '../App.css'
import '../styles/AdminPanel.css'

const initialFormState = { title: '', description: '', type: 'post' }

export function AdminPanelComponent() {

    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([])
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function (e) {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                //console.log("height: " + panel.style.maxHeight);
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = "100%";
                }
                //console.log("new height: " + panel.style.maxHeight);
            });
        }
        fetchPosts();
        fetchImages();
    }, []);


    async function fetchPosts() {
        const apiData = await API.graphql({ query: postsByDate });
        const postsFromAPI = apiData.data.postsByDate.items;
        await Promise.all(postsFromAPI.map(async post => {
            if (post.image) {
                const image = await Storage.get(post.image);
                post.image = image;
            }
            return post;
        }))
        setPosts(apiData.data.postsByDate.items);
    }

    async function fetchImages() {
        const image1 = await Storage.get('homepage0.jpg');
        const image2 = await Storage.get('homepage1.jpg');
        setImages([image1, image2]);
    }

    async function createPost() {
        if (!formData.title || !formData.description) return;
        await API.graphql({ query: createPostMutation, variables: { input: formData } });
        if (formData.image) {
            const image = await Storage.get(formData.image);
            formData.image = image;
        }
        setPosts([formData, ...posts]);
        setFormData(initialFormState);
    }

    async function deletePost({ id }) {
        console.log("Deleting id: " + id);
        const newPostsArray = posts.filter(post => post.id !== id);
        setPosts(newPostsArray);
        await API.graphql({ query: deletePostMutation, variables: { input: { id } } });
    }

    async function postImgChange(e) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        setFormData({ ...formData, image: file.name });
        await Storage.put(file.name, file);
        fetchPosts();
    }

    async function adminImgChange(e, i) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        await Storage.put("homepage" + i + ".jpg", file);
        fetchImages();
    }

    return (
        <div id="adminpage">
            <AmplifyAuthenticator>
                <AmplifySignIn slot="sign-in">
                    <div slot="secondary-footer-content"></div>
                </AmplifySignIn>
                <div className="App">
                    <HeaderComponent />



                    <button className="accordion">Create a Post</button>
                    <div className="panel">
                        <div className="flex-container">
                            <ul className="flex-outer">
                                <li className="postInput">
                                    <label>Select the category of your post: </label>
                                    <select defaultValue="" value={formData.category} onChange={e => setFormData({ ...formData, 'category': e.target.value })}>
                                        <option value="" disabled>Choose cateory</option>
                                        <option value="foodrecipe">Food Recipe</option>
                                        <option value="drinkrecipe">Drink Recipe</option>
                                        <option value="blogpost">Blog Post</option>
                                        <option value="recommendation">Recommendation</option>
                                        <option value="technique">Kitchen Technique</option>
                                        <option value="">None</option>
                                    </select>
                                </li>
                                <li className="postInput">
                                    <label>Give your post a title: </label>
                                    <input
                                        onChange={e => setFormData({ ...formData, 'title': e.target.value })}
                                        placeholder="Post title (required)"
                                        value={formData.title}
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add a body/description to your post: </label>
                                    <textarea
                                        rows="6"
                                        onChange={e => setFormData({ ...formData, 'description': e.target.value })}
                                        placeholder="Post description (required)"
                                        value={formData.description}
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add a video link: </label>
                                    <input
                                        onChange={e => setFormData({ ...formData, 'video': e.target.value.split("v=").slice(-1)[0] })}
                                        placeholder="Link to Youtube video"
                                        value={formData.video}
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add an image: </label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={postImgChange}
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add tags: </label>
                                    <input
                                        onChange={e => setFormData({ ...formData, 'tags': e.target.value.split(",").map(item => item.trim()) })}
                                        placeholder="Tags must be separated by commas"
                                        value={formData.tags}
                                    />
                                </li>
                                <li>
                                    <button onClick={createPost}>Create Post</button>
                                </li>
                            </ul>
                        </div>
                    </div>



                    <button className="accordion">Manage Website Images</button>
                    <div className="panel">
                        <div className="ImageControls">
                            <h1>Images</h1>
                            <div style={{ marginBottom: 30 }}>
                                {
                                    images.map((image, index) => (
                                        <div key={index} className="admin-image">
                                            <img className="image-button" src={image} alt="Just testing." onClick={() => { document.getElementById("imgupdate" + index).click() }} />
                                            <div className="image-text">Click image to update</div>
                                            <input id={"imgupdate" + index} type="file" accept="image/png, image/jpeg" onChange={e => adminImgChange(e, index)} style={{ display: 'none' }} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>



                    <button className="accordion">My Posts</button>
                    <div className="panel">
                        <div className="PostViewer">
                            <div style={{ marginBottom: 30 }}>
                                {
                                    posts.map(post => (
                                        <div key={post.id || post.title}>
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
                                            <h2>{post.title}</h2>
                                            <p>{post.description}</p>
                                            <div>
                                                {
                                                    post.image && <img src={post.image} style={{ width: 400 }} alt="Just testing." />
                                                }
                                            </div>
                                            <button onClick={() => deletePost(post)}>Delete post</button>
                                            <div>
                                                <p>-----------------------------------------------------</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="signout-buffer">


                </div>
                <AmplifySignOut />

            </AmplifyAuthenticator>
        </div >


    )

}

