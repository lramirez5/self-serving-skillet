import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { categoryByDate } from '../graphql/queries';
import { HeaderComponent } from './HeaderComponent';

export function ListBlogPostsComponent() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const apiData = await API.graphql({ query: categoryByDate, variables: { category: "blogpost" } });
        const postsFromAPI = apiData.data.categoryByDate.items;
        await Promise.all(postsFromAPI.map(async post => {
            if (post.image) {
                const image = await Storage.get(post.image);
                post.image = image;
            }
            return post;
        }))
        setPosts(apiData.data.categoryByDate.items);
    }

    return (
        <div className="App">
            <HeaderComponent />
            <h1>Blog Posts</h1>
            <div style={{ marginBottom: 30 }}>
                {
                    posts.map(post => (
                        <div key={post.id || post.title}>
                            <h2>{post.title}</h2>
                            <p>{post.description}</p>
                            {
                                post.image && <img src={post.image} style={{ width: 400 }} alt="Just testing." />
                            }
                        </div>
                    ))
                }
            </div>
            
        </div>
    )

}

