import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { postsByDate } from '../graphql/queries';
import { createPost as createPostMutation, deletePost as deletePostMutation, updatePost as updatePostMutation } from '../graphql/mutations';
import '../App.css'
import '../styles/AdminPanel.css'
import { NavbarComponent } from './NavbarComponent';

const initialFormState = { id: '', category: '', title: '', description: '', video: '', images: [], tags: [], type: 'post' }

export function AdminPanelComponent() {

    var newPostData = initialFormState;
    var updatedPostData = initialFormState;

    var idToDelete;

    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([])
    //const [formData, setFormData] = useState(initialFormState);
    //const [updateData, setUpdateData] = useState(initialFormState);

    useEffect(async function() {
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function (e) {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = "100%";
                    fetchPosts();
                }
            });
        }
        await fetchPosts();
        fetchImages();

        let scrollId = document.location.href.split('#');
        if (scrollId[1]) {
            //console.log('Scrolling to '+scrollId[1])
            let el = document.getElementById(scrollId[1]);
            if (el) {
                //console.log('Scrolled')
                //console.log(el)
                el.scrollIntoView(true);
                window.scrollTo(window.scrollX, window.scrollY - 40);
            }
        }
    }, []);


    async function fetchPosts() {
        const apiData = await API.graphql({ query: postsByDate });
        const postsFromAPI = apiData.data.postsByDate.items;
        await Promise.all(postsFromAPI.map(async post => {
            if (post.images) {
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
        getFormData();
        if (!newPostData.title || !newPostData.description || !newPostData.category) return;
        await API.graphql({ query: createPostMutation, variables: { input: newPostData } });
        //if (newPostData.images !== '') {
        for (let i = 0; i < newPostData.images.length; i++) {
            const image = await Storage.get(newPostData.images[i]);
            newPostData.images[i] = image;
        }
        //const image = await Storage.get(formData.image);
        //formData.image = image;
        //}
        setPosts([newPostData, ...posts]);
        clearFormData();
        document.getElementsByClassName('accordion')[0].click();
        /*if (!formData.title || !formData.description) return;
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
        setFormData(initialFormState);*/
    }

    async function updatePost() {
        var idUpdate = getUpdateData();
        if (idUpdate) {
            if (!updatedPostData.title || !updatedPostData.description || !updatedPostData.category) return;
            await API.graphql({ query: deletePostMutation, variables: { input: { id: idToDelete } } });
            const newPostsArray = posts.filter(post => post.id !== idToDelete);
            await API.graphql({ query: createPostMutation, variables: { input: updatedPostData } });
            for (let i = 0; i < updatedPostData.images.length; i++) {
                const image = await Storage.get(updatedPostData.images[i]);
                updatedPostData.images[i] = image;
            }
            //const image = await Storage.get(formData.image);
            //formData.image = image;
            //}
            setPosts([updatedPostData, ...newPostsArray]);
            closeUpdatePost();
        } else {
            if (!updatedPostData.title || !updatedPostData.description || !updatedPostData.category) return;
            updatedPostData.tags = updatedPostData.tags.filter((value, index) => updatedPostData.tags.indexOf(value) === index);
            await API.graphql({ query: updatePostMutation, variables: { input: updatedPostData } });
            if (updatedPostData.images) {
                for (let i = 0; i < updatedPostData.images.length; i++) {
                    const image = await Storage.get(updatedPostData.images[i]);
                    updatedPostData.images[i] = image;
                }
                //const image = await Storage.get(formData.image);
                //formData.image = image;
            }
            const newPostsArray = posts.filter(post => post.id !== updatedPostData.id);
            //setPosts(newPostsArray);
            setPosts([updatedPostData, ...newPostsArray]);
            closeUpdatePost();
        }
    }

    async function deletePost({ id }) {
        if (window.confirm(`Remove ${id} from your posts?`)) {
            console.log("Deleting: " + id);
            const newPostsArray = posts.filter(post => post.id !== id);
            setPosts(newPostsArray);
            await API.graphql({ query: deletePostMutation, variables: { input: { id } } });
        }
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
        //setFormData({ ...formData, images: filenames });
        newPostData.images = filenames;
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
        //if (updateData.images) {
        updatedPostData.images = [...updatedPostData.images, ...filenames];
        //setUpdateData({ ...updateData, 'images': [...updateData.images, ...filenames] });
        //} else {
        //setUpdateData({ ...updateData, 'images': filenames });
        //}
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
        updatedPostData = initialFormState;
        updatedPostData.id = id;
        updatedPostData.category = category;
        updatedPostData.title = title;
        updatedPostData.description = description;
        updatedPostData.video = video;
        updatedPostData.tags = tags;

        document.getElementById("myNav").style.width = "100%";
        document.getElementById("up-category").value = category;
        for (var option of document.getElementById('up-category').options) {
            if (tags.includes(option.value)) {
                option.selected = true;
            }
        }
        document.getElementById("up-title").value = title;
        document.getElementById("up-desc").value = description.replace(/<br\/>/g, '\n').replace(/<a.*?>/g, '').replace(/<\/a>/g, '').replace(/<h3>/g, '<!').replace(/<\/h3>/g, '!>').replace(/<h4>/g, '<*').replace(/<\/h4>/g, '*>');
        document.getElementById("up-video").value = "https://www.youtube.com/watch?v=" + video;
        if (images && images[0]) {
            document.getElementById("curr-images").innerHTML = '';
            var imagenames = [];
            images.forEach(image => {
                let name = JSON.stringify(image).split('public/')[1].split('?')[0];
                document.getElementById("curr-images").innerHTML += `<img src=${image} width='20%' alt="Just testing." />`;
                imagenames.push(name);
            })
            updatedPostData.images = imagenames;

        }
        document.getElementById("up-tags").value = tags;
        //console.log(updatedPostData);

        //setUpdateData({ ...updateData, 'id': id, 'category': category, 'title': title, 'description': description, 'video': video, 'images': imagenames, 'tags': tags });
    }

    function closeUpdatePost() {
        //setUpdateData(initialFormState);
        document.getElementById("up-category").value = '';
        document.getElementById("up-title").value = '';
        document.getElementById("up-desc").innerHTML = '';
        document.getElementById("up-video").value = '';
        document.getElementById("up-images").value = '';
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
            //console.log('img: '+img)

            if (window.confirm(`Remove ${img} from this post?`)) {
                //console.log(updatedPostData.images)
                if (updatedPostData.images.length !== 0) {
                    var names = [];
                    updatedPostData.images.forEach(image => names.push(image));
                    var index = names.indexOf(img);
                    //console.log("index: "+index)
                    if (index > -1) {
                        names.splice(index, 1);
                        //console.log(names);
                        //setUpdateData({ ...updateData, 'images': names });
                        updatedPostData.images = names;
                        e.target.style.opacity = "0";
                        //e.target.style.border =  "1px solid red"
                        //console.log(updatedPostData.images);
                    }
                }
            }
        }
    }

    function getFormData() {
        newPostData.id = document.getElementById("create-title").value.toLowerCase().trim().replace(/[^A-Za-z0-9 ]/g, ' ').replace(/\s+/g, '-');
        newPostData.category = document.getElementById("create-category").value;
        newPostData.title = document.getElementById("create-title").value;
        newPostData.description = urlify(document.getElementById("create-desc").value.replace(/<!/g, '<h3>').replace(/!>/g, '</h3>').replace(/<\*/g, '<h4>').replace(/\*>/g, '</h4>')).replace(/\n/g, '<br/>');
        newPostData.video = document.getElementById("create-video").value.split("v=").slice(-1)[0];
        var selected = [];
        for (var option of document.getElementById('create-category').options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        //console.log(selected);
        newPostData.tags = [newPostData.id.replaceAll('-',''), ...selected, ...document.getElementById("create-tags").value.split(",").map(item => item.replace(/[^A-Za-z0-9]/g, '').toLowerCase())];
    }

    function clearFormData() {
        document.getElementById("create-category").value = '';
        document.getElementById("create-title").value = '';
        document.getElementById("create-desc").value = '';
        document.getElementById("create-video").value = '';
        document.getElementById("create-images").value = '';
        document.getElementById("create-tags").value = '';
    }

    function getUpdateData() {
        var isIdUpdated = false;
        idToDelete = null;
        if (updatedPostData.id !== document.getElementById("up-title").value.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-')) {
            isIdUpdated = true;
            //const newPostsArray = posts.filter(post => post.id !== updatedPostData.id);
            //setPosts(newPostsArray);
            idToDelete = updatedPostData.id;
            //await API.graphql({ query: deletePostMutation, variables: { input: { idToDelete } } });
        }
        updatedPostData.id = document.getElementById("up-title").value.toLowerCase().trim().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-');
        updatedPostData.category = document.getElementById("up-category").value;
        updatedPostData.title = document.getElementById("up-title").value;
        updatedPostData.description = urlify(document.getElementById("up-desc").value.replace(/<!/g, '<h3>').replace(/!>/g, '</h3>').replace(/<\*/g, '<h4>').replace(/\*>/g, '</h4>')).replace(/\n/g, '<br/>');
        updatedPostData.video = document.getElementById("up-video").value.split("v=").slice(-1)[0];
        var selected = [];
        for (var option of document.getElementById('up-category').options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        //console.log(selected);
        updatedPostData.tags = [updatedPostData.id.replaceAll('-',''), ...selected, ...document.getElementById("up-tags").value.split(",").map(item => item.replace(/[^A-Za-z0-9]/g, '').toLowerCase())];
        return isIdUpdated;
    }

    return (
        <div id="adminpage">
            <AmplifyAuthenticator>
                <AmplifySignIn slot="sign-in">
                    <div slot="secondary-footer-content"></div>
                </AmplifySignIn>
                <div className="App">
                    <NavbarComponent />
                    <div id="myNav" className="overlay">
                        <p className="closebtn" onClick={() => { closeUpdatePost() }}>&times;</p>
                        <div className="overlay-content">
                            <div className="flex-container">
                                <ul className="flex-outer">
                                    <li className="postInput">
                                        <label>Select the category of your post: </label>
                                        <select id="up-category" multiple>
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
                                            placeholder="Post title (required)"
                                            id="up-title"
                                        />
                                    </li>
                                    <li className="postInput">
                                        <label>Add a body/description to your post: </label>
                                        <textarea
                                            rows="6"
                                            placeholder="Post description (required)"
                                            id="up-desc"
                                        />
                                    </li>
                                    <li className="postInput">
                                        <label>Add a video link: </label>
                                        <input
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
                                    <label>Select the category of your post:<br /><span style={{ fontSize: '8pt' }}>(hold 'ctrl' to select multiple)</span></label>
                                    <select id="create-category" defaultValue={[""]} multiple >
                                        <option value="foodrecipe">Food Recipe</option>
                                        <option value="drinkrecipe">Drink Recipe</option>
                                        <option value="theory">Cooking Theory</option>
                                        <option value="essentials">Kitchen Essentials</option>
                                        <option value="technique">Technique</option>
                                    </select>
                                </li>
                                <li className="postInput">
                                    <label>Give your post a unique title:<br /><span style={{ fontSize: '8pt' }}>(5 or less words recommended)</span></label>
                                    <input
                                        id="create-title"
                                        placeholder="Post title (required)"
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add a body/description to your post: <br />
                                        <span style={{ fontSize: '6pt' }}>To create headers:<br />
                                            <strong style={{ color: 'black', fontSize: '10pt' }}>&lt;!</strong><em>Your heading text</em><strong style={{ color: 'black', fontSize: '10pt' }}>!&gt;</strong> or <br />
                                            <strong style={{ color: 'black', fontSize: '10pt' }}>&lt;*</strong><em>Your subheading text</em><strong style={{ color: 'black', fontSize: '10pt' }}>*&gt;</strong>
                                        </span>
                                    </label>
                                    <textarea
                                        id="create-desc"
                                        rows="6"
                                        placeholder="Post description (required)"
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add a video link: </label>
                                    <input
                                        id="create-video"
                                        placeholder="Link to Youtube video"
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add image(s): </label>
                                    <input
                                        id="create-images"
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        multiple={true}
                                        onChange={postImgChange}
                                    />
                                </li>
                                <li className="postInput">
                                    <label>Add tags:
                                        <div className="tooltip"><span style={{ background: 'rgba(0,0,0,.4)', borderRadius: '6px', textTransform: 'lowercase', fontSize: '6pt', padding: '8px', textAlign: 'center' }}>About tags</span>
                                            <span className="tooltiptext" style={{ fontSize: '9pt' }}>A note about tags:<br />
                                                <span style={{ color: '#ccccff' }}>Tags are used for searchability and any tags you add will be converted down to lowercase letters (and numbers). For example, adding a "Shepherd's Pie 2.0" tag will reduce to "shepherdspie20".
                                                </span><br />
                                                <span style={{ color: '#ccffcc' }}>Also of note, a long/wordy tag can replace several short tags. A post with the tag "buffalochickentacos" does not need additional "chicken" and "taco" tags since both are already included in the tag.
                                                </span><br />
                                                <span style={{ color: '#ffcccc' }}>Finally, pluralizing tags is better for searchability. A post tagged "balsamicvinegar" WON'T show up if a user searches "vinegars". Tagging "balsamicvinegars" will fix this.
                                                </span>
                                            </span>
                                        </div></label>
                                    <input
                                        id="create-tags"
                                        placeholder="Tags must be separated by commas"
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

                    <div>
                        <div className="PostViewer" >
                            <div style={{ marginBottom: 30 }}>
                                <h1 style={{ background: '#cccccc' }}>My Posts</h1>
                                <p style={{ borderBottom: '2px solid black', paddingBottom: '12px' }}>Want to jump to a specific post? Go to <strong>www.selfservingskillet.com/admin#&lt;&lt;post-title&gt;&gt;</strong> <br />
                                    Example: To update the post at www.selfservingskillet.com/recipes/<strong>carbonara-and-cake</strong>, go to www.selfservingskillet.com/admin<strong>#carbonara-and-cake</strong> </p>
                                {
                                    posts.map(post => (
                                        <div key={post.id || post.title} id={post.id} style={{ borderBottom: '2px solid black', padding: '24px' }}>
                                            <h2>{post.title}</h2>
                                            <p><a href={`/view/${post.id}`} target='_blank' rel='noreferrer'>See post</a></p>
                                            <button style={{ margin: '0 3px' }} onClick={() => deletePost(post)}>Delete post</button>
                                            <button style={{ margin: '0 3px' }} onClick={() => showUpdatePost(post)}>Update post</button>
                                            <p className="post-desc-p" style={{ textAlign: 'left', fontSize: '10pt' }} dangerouslySetInnerHTML={{ __html: post.description }}></p>
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
                                                    post.images && post.images.length > 0 && post.images.map(image => (
                                                        <img key={image.substring(50, 250)} src={image} style={{ width: 120 }} alt="Just testing." />
                                                    ))
                                                }
                                            </div>
                                            <p style={{ textAlign: 'left', fontSize: '9pt', color: 'gray', width: '95%', height: 'auto' }} dangerouslySetInnerHTML={{ __html: 'Tags: ' + post.tags.toString().replaceAll(',', ', ') }}></p>
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