import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { categoryByDate } from '../graphql/queries';
import '../styles/PostList.css';
import { NavbarComponent } from './NavbarComponent';

export function PostListComponent() {
    const { cat } = useParams();
    var pageTitle = '';
    var postCategory;

    switch (cat) {
        case 'recipes':
            pageTitle = 'Recipes'
            postCategory = 'foodrecipe'
            break;
        case 'drinks':
            pageTitle = 'Recipes'
            postCategory = 'drinkrecipe'
            break;
        case 'theory':
            pageTitle = 'Cooking Theory'
            postCategory = 'theory'
            break;
        case 'essentials':
            pageTitle = 'Kitchen Essentials'
            postCategory = 'essentials'
            break;
        case 'techniques':
            pageTitle = 'Technique Tuesdays'
            postCategory = 'technique'
            break;
        default:
            document.location.href = '/Content-Not-Found';
    }
    console.log(cat, postCategory)

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, [cat]);

    async function fetchPosts() {
        const apiData = await API.graphql({ query: categoryByDate, variables: { category: postCategory } });
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
            <NavbarComponent />
            <h1 style={{fontFamily: 'Signika', color: 'lemonchiffon', background: 'rgba(0,0,0,.6)', padding: '40px 0 40px'}}>{pageTitle}</h1>
            <div id="list-container" style={{ marginBottom: 30 }}>
                {
                    posts.map(post => (
                        <Link to={"/recipes/" + post.id} key={post.id || post.title} >
                            <div data-key={post.id} className="post-preview" >
                                <article className="preview-content">
                                    {
                                        post.video
                                            ? <img src={`https://img.youtube.com/vi/${post.video}/0.jpg`} alt="" />
                                            : post.images[0]
                                                ? <img src={post.images[0]} alt="" />
                                                : <img src="https://yt3.ggpht.com/ytc/AAUvwngy3103R0HdhHNVoLjs9ecQwmBqPMQ7t1nF6LDA=s176-c-k-c0x00ffffff-no-rj" alt="Watch Self Serving Skillet on Youtube" />
                                    }
                                    <div>
                                        <h2>{post.title}</h2>
                                        <p>{post.description.replace(/<br ?\/>/g, '\n').split('.')[0].substring(0, 100) + '...'}</p>
                                    </div>
                                </article>
                            </div>
                        </Link>
                    ))
                }
            </div>

        </div>
    )

}

