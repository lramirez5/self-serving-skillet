import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { postsByDate } from '../graphql/queries';
import { createPost as createPostMutation, deletePost as deletePostMutation, updatePost as updatePostMutation } from '../graphql/mutations';
import { HeaderComponent } from './HeaderComponent';
import '../App.css'
import '../styles/AdminPanel.css'

const initialFormState = { id: '', category: '', title: '', description: '', video: '', images: '', tags: '', type: 'post' }

export function AdminPanelComponent() {

    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([])
    const [formData, setFormData] = useState(initialFormState);
    const [updateData, setUpdateData] = useState(initialFormState);

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
            if (post.images[0] !== '') {
                for (let i = 0; i < post.images.length; i++) {
                    const image = await Storage.get(post.images[i]);
                    post.images[i] = image;
                }
                //const image = await Storage.get(post.image);
                //post.image = image;
            }
            return post;
        }))
        //console.log(postsFromAPI);
        setPosts(postsFromAPI);
    }

    async function fetchImages() {
        const image1 = await Storage.get('homepage0.jpg');
        const image2 = await Storage.get('homepage1.jpg');
        setImages([image1, image2]);
    }

    async function createPost() {
        if (!formData.title || !formData.description) return;
        await API.graphql({ query: createPostMutation, variables: { input: formData } });
        if (formData.images !== '') {
            for (let i = 0; i < formData.images.length; i++) {
                const image = await Storage.get(formData.images[i]);
                formData.images[i] = image;
            }
            //const image = await Storage.get(formData.image);
            //formData.image = image;
        }
        setPosts([formData, ...posts]);
        setFormData(initialFormState);
    }

    async function updatePost() {
        if (!updateData.title || !updateData.description) return;
        await API.graphql({ query: updatePostMutation, variables: { input: updateData } });
        if (updateData.images !== '') {
            for (let i = 0; i < updateData.images.length; i++) {
                const image = await Storage.get(updateData.images[i]);
                updateData.images[i] = image;
            }
            //const image = await Storage.get(formData.image);
            //formData.image = image;
        }
        const newPostsArray = posts.filter(post => post.id !== updateData.id);
        //setPosts(newPostsArray);
        setPosts([updateData, ...newPostsArray]);
        closeUpdatePost();
    }

    async function deletePost({ id }) {
        console.log("Deleting: " + id);
        const newPostsArray = posts.filter(post => post.id !== id);
        setPosts(newPostsArray);
        await API.graphql({ query: deletePostMutation, variables: { input: { id } } });
    }

    async function postImgChange(e) {
        if (!e.target.files[0]) return
        const files = e.target.files;
        const filenames = [];
        Array.prototype.forEach.call(files, async function (file) {
            filenames.push(file.name);
            await Storage.put(file.name, file);
        });
        /*for (let i = 0; i < files.length; i++) {
            filenames.push(files[i].name);
            await Storage.put(files[i].name, files[i]);
        }*/
        //console.log(filenames);
        setFormData({ ...formData, images: filenames });
        //setFormData({ ...formData, image: file.name });
        //await Storage.put(file.name, file);
        fetchPosts();
    }

    async function updatePostImgChange(e) {
        if (!e.target.files[0]) return
        const files = e.target.files;
        const filenames = [];
        Array.prototype.forEach.call(files, async function (file) {
            filenames.push(file.name);
            await Storage.put(file.name, file);
        });
        /*for (let i = 0; i < files.length; i++) {
            filenames.push(files[i].name);
            await Storage.put(files[i].name, files[i]);
        }*/
        //console.log([...updateData.images, ...filenames]);
        if (updateData.images) {
            setUpdateData({ ...updateData, 'images': [...updateData.images, ...filenames] });
        } else {
            setUpdateData({ ...updateData, 'images': filenames });
        }
        //setFormData({ ...formData, image: file.name });
        //await Storage.put(file.name, file);
        //fetchPosts();
    }

    async function adminImgChange(e, i) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        await Storage.put("homepage" + i + ".jpg", file);
        fetchImages();
    }

    function urlify(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function (url) {
            return '<a href="' + url + '" target="_blank" rel="noreferrer">' + url + '</a>';
        })
    }

    function showUpdatePost({ id, category, title, description, video, images, tags }) {
        document.getElementById("myNav").style.width = "100%";
        document.getElementById("up-category").value = category;
        document.getElementById("up-title").value = title;
        document.getElementById("up-desc").value = description.replace(/<br\/>/g, '\n');
        document.getElementById("up-video").value = video;
        if (images[0]) {
            document.getElementById("curr-images").innerHTML = '';
            var imagenames = [];
            images.forEach(image => {
                let name = JSON.stringify(image).split('public/')[1].split('?')[0];
                document.getElementById("curr-images").innerHTML += `<img src=${image} width='20%' alt="Just testing." />`;
                imagenames.push(name);
            })
        }
        document.getElementById("up-tags").value = tags;
        setUpdateData({ ...updateData, 'id': id, 'category': category, 'title': title, 'description': description, 'video': video, 'images': imagenames, 'tags': tags });
    }

    function closeUpdatePost() {
        setUpdateData(initialFormState);
        document.getElementById("up-category").value = '';
        document.getElementById("up-title").value = '';
        document.getElementById("up-desc").innerHTML = '';
        document.getElementById("up-video").value = '';
        document.getElementById("curr-images").innerHTML = 'No images';
        document.getElementById("up-tags").value = '';
        document.getElementById("myNav").style.width = "0%";
    }

    /*document.getElementById("curr-images").addEventListener('click', e => {
        if (e.target.src) {
            let name = JSON.stringify(e.target.src).split('public/')[1].split('?')[0];
            removeImage(name);
        }
    });*/

    function removeImage(e) {
        if (e.target.src) {
            if (e.target.style.opacity === '0') return;
            let img = JSON.stringify(e.target.src).split('public/')[1].split('?')[0];

            if (window.confirm(`Remove ${img} from this post?`)) {
                //console.log(updateData.images)
                if (updateData.images[0]) {
                    var names = [];
                    updateData.images.forEach(image => names.push(image));
                    var index = names.indexOf(img);
                    //console.log("index: "+index)
                    if (index > -1) {
                        names.splice(index, 1);
                        //console.log(names);
                        setUpdateData({ ...updateData, 'images': names });
                        e.target.style.opacity = "0";
                        //e.target.style.border =  "1px solid red"
                        //console.log(updateData.images);
                    }
                }
            }
        }
    }

    return (
        <div id="adminpage">
            <AmplifyAuthenticator>
                <AmplifySignIn slot="sign-in">
                    <div slot="secondary-footer-content"></div>
                </AmplifySignIn>
                <div className="App">
                    <HeaderComponent />
                    <div id="myNav" className="overlay">
                        <p className="closebtn" onClick={() => { closeUpdatePost() }}>&times;</p>
                        <div className="overlay-content">
                            <div className="flex-container">
                                <ul className="flex-outer">
                                    <li className="postInput">
                                        <label>Select the category of your post: </label>
                                        <select id="up-category" onChange={e => setUpdateData({ ...updateData, 'category': e.target.value })}>
                                            <option value="foodrecipe">Food Recipe</option>
                                            <option value="drinkrecipe">Drink Recipe</option>
                                            <option value="theory">Cooking Theory</option>
                                            <option value="essentials">Kitchen Essentials</option>
                                            <option value="technique">Technique</option>
                                            <option value="">None (not recommended)</option>
                                        </select>
                                    </li>
                                    <li className="postInput">
                                        <label>Give your post a title: </label>
                                        <input
                                            onChange={e => setUpdateData({ ...updateData, 'title': e.target.value, 'id': e.target.value.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-') })}
                                            placeholder="Post title (required)"
                                            id="up-title"
                                        />
                                    </li>
                                    <li className="postInput">
                                        <label>Add a body/description to your post: </label>
                                        <textarea
                                            rows="6"
                                            onChange={e => setUpdateData({ ...updateData, 'description': urlify(e.target.value).replace(/\n/g, '<br/>') })}
                                            placeholder="Post description (required)"
                                            id="up-desc"
                                        />
                                    </li>
                                    <li className="postInput">
                                        <label>Add a video link: </label>
                                        <input
                                            onChange={e => setUpdateData({ ...updateData, 'video': e.target.value.split("v=").slice(-1)[0] })}
                                            placeholder="Link to Youtube video"
                                            id="up-video"
                                        />
                                    </li>
                                    <li className="postInput">
                                        <label>Add image(s): </label>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            multiple={true}
                                            onChange={updatePostImgChange}
                                            id="up-images"
                                        />
                                    </li>
                                    <li>
                                        <div id="curr-images" onClick={e => removeImage(e)}>No images</div>
                                    </li>
                                    <li className="postInput">
                                        <label>Add tags: </label>
                                        <input
                                            onChange={e => setUpdateData({ ...updateData, 'tags': e.target.value.split(",").map(item => item.trim()) })}
                                            placeholder="Tags must be separated by commas"
                                            id="up-tags"
                                        />
                                    </li>
                                    <li>
                                        <button onClick={updatePost}>Update Post</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button className="accordion">Create a Post</button>
                    <div className="panel">
                        <div className="flex-container">
                            <ul className="flex-outer">
                                <li className="postInput">
                                    <label>Select the category of your post: </label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, 'category': e.target.value })}>
                                        <option value="foodrecipe">Food Recipe</option>
                                        <option value="drinkrecipe">Drink Recipe</option>
                                        <option value="theory">Cooking Theory</option>
                                        <option value="essentials">Kitchen Essentials</option>
                                        <option value="technique">Technique</option>
                                        <option value="">None (not recommended)</option>
                                    </select>
                                </li>
                                <li className="postInput">
                                    <label>Give your post a title: </label>
                                    <input
                                        onChange={e => setFormData({ ...formData, 'title': e.target.value, 'id': e.target.value.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-') })}
                                        placeholder="Post title (required)"
                                        value={formData.title}
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add a body/description to your post: </label>
                                    <textarea
                                        rows="6"
                                        onChange={e => setFormData({ ...formData, 'description': urlify(e.target.value).replace(/\n/g, '<br/>') })}
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
                                    <label>Add image(s): </label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        multiple={true}
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
                        <div className="PostViewer" >
                            <div style={{ marginBottom: 30 }}>
                                {
                                    posts.map(post => (
                                        <div key={post.id || post.title} style={{ borderBottom: '2px solid black', padding: '24px' }}>
                                            <h2>{post.title}</h2>
                                            <p>{post.description}</p>
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
                                                {
                                                    //post.images[0] && <img src={post.images[0]} style={{ width: 400 }} alt="Just testing." />
                                                    post.images && post.images[0] && post.images.map(image => (
                                                        <img key={image.substring(50, 250)} src={image} style={{ width: 120 }} alt="Just testing." />
                                                    ))
                                                }
                                            </div>
                                            <button onClick={() => deletePost(post)}>Delete post</button>
                                            <button onClick={() => showUpdatePost(post)}>Update post</button>
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