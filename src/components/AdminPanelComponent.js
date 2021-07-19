import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { postsByDate } from '../graphql/queries';
import { createPost as createPostMutation, deletePost as deletePostMutation } from '../graphql/mutations';
import { HeaderComponent } from './HeaderComponent';

const initialFormState = { title: '', description: '', type: 'post' }

export function AdminPanelComponent() {

    const [posts, setPosts] = useState([]);
    //const [postType, setPostType] = useState("recipe")
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchPosts();
    }, []);


    async function fetchPosts() {
        const apiData = await API.graphql({ query: postsByDate });
        const postsFromAPI = apiData.data.postsByDate.items;
        console.log("FETCHED:");
        console.log(postsFromAPI);
        await Promise.all(postsFromAPI.map(async post => {
            if (post.image) {
                const image = await Storage.get(post.image);
                post.image = image;
            }
            return post;
        }))
        setPosts(apiData.data.postsByDate.items);
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
        console.log("Deleting id: "+id);
        const newPostsArray = posts.filter(post => post.id !== id);
        setPosts(newPostsArray);
        await API.graphql({ query: deletePostMutation, variables: { input: { id } } });
    }

    async function onChange(e) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        setFormData({ ...formData, image: file.name });
        await Storage.put(file.name, file);
        fetchPosts();
    }

    return (
        <div id="adminpage">
            <AmplifyAuthenticator>
                <AmplifySignIn slot="sign-in">
                    <div slot="secondary-footer-content"></div>
                </AmplifySignIn>
                <div className="App">
                <HeaderComponent />
                    <h1>My Posts</h1>
                    <input
                        type="file"
                        onChange={onChange}
                    />
                    <input
                        onChange={e => setFormData({ ...formData, 'title': e.target.value })}
                        placeholder="Post title"
                        value={formData.title}
                    />
                    <input
                        onChange={e => setFormData({ ...formData, 'description': e.target.value })}
                        placeholder="Post description"
                        value={formData.description}
                    />
                    <select onChange={e => setFormData({ ...formData, 'category': e.target.value })}>
                        <option value=""></option>
                        <option value="foodrecipe">Food</option>
                        <option value="drinkrecipe">Drink</option>
                        <option value="blogpost">Blog</option>
                    </select>
                    <button onClick={createPost}>Create Post</button>
                    <div style={{ marginBottom: 30 }}>
                        {
                            posts.map(post => (
                                <div key={post.id || post.title}>
                                    <h2>{post.title}</h2>
                                    <p>{post.description}</p>
                                    <button onClick={() => deletePost(post)}>Delete post</button>
                                    {
                                        post.image && <img src={post.image} style={{ width: 400 }} alt="Just testing." />
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
                <AmplifySignOut />

            </AmplifyAuthenticator>
        </div>
    )

}

