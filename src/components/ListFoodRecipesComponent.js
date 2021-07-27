import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { categoryByDate } from '../graphql/queries';
import { HeaderComponent } from './HeaderComponent';
import '../styles/FoodRecipeList.css';

export function ListFoodRecipesComponent() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
        //console.log(document.getElementsByClassName('post-preview'));
    }, []);

    async function fetchPosts() {
        const apiData = await API.graphql({ query: categoryByDate, variables: { category: "foodrecipe" } });
        console.log("Got data");
        console.log(apiData);
        const postsFromAPI = apiData.data.categoryByDate.items;
        await Promise.all(postsFromAPI.map(async post => {
            if (post.images[0]) {
                /*for (let i = 0; i < post.images.length; i++) {
                    const image = await Storage.get(post.images[i]);
                    post.images[i] = image;
                }*/
                const image = await Storage.get(post.images[0]);
                post.images[0] = image;
            }
            return post;
        }))
        //console.log(postsFromAPI);
        setPosts(postsFromAPI);
    }

    return (
        <div className="App">
            <HeaderComponent />
            <h1>Food Recipes</h1>
            <div id="food-container" style={{ marginBottom: 30 }}>
                {
                    posts.map(post => (
                        <Link to={"/recipes/"+post.id} key={post.id || post.title} >
                            <div data-key={post.id} className="post-preview" >
                                <article className="preview-content">
                                    <div>
                                        {
                                            post.video
                                                ? <img src={`https://img.youtube.com/vi/${post.video}/0.jpg`} alt="" />
                                                : post.images[0] 
                                                    ? <img src={post.images[0]} style={{width:"400px"}} alt="" />
                                                    : <img src="https://yt3.ggpht.com/ytc/AAUvwngy3103R0HdhHNVoLjs9ecQwmBqPMQ7t1nF6LDA=s176-c-k-c0x00ffffff-no-rj" style={{width:"400px"}} alt="Watch Self Serving Skillet on Youtube" />
                                        }
                                    </div>
                                    <h2>{post.title}</h2>
                                    <p>{post.description}</p>
                                </article>
                            </div>
                        </Link>
                    ))
                }
            </div>

        </div>
    )

}

