import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { categoryByDate, postsByDate } from '../graphql/queries';
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

    const [posts, setPosts] = useState([]);
    const [unfilteredPosts, setUnfilteredPosts] = useState([]);
    const [searchterm, setSearchTerm] = useState('');
    const [searchfilter, setSearchFilter] = useState('new');

    useEffect(() => {
        fetchPosts();
        window.scrollTo(0, 0);
        var old_element = document.getElementById("search-input");
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        let el = document.getElementById("search-input")
        el.addEventListener("keyup", e => {
            e.preventDefault();
            let keypress = e.key || e.keyIdentifier || e.keyCode || e.which;
            if (keypress === 'Enter' || keypress === 13) {
                setSearch();
            }
        });
        el.value = '';
        setSearchTerm('')
        setSearchFilter('new');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cat]);

    async function fetchPosts() {
        const apiData = await API.graphql({ query: postsByDate });//, filter: {tags: {contains:"test"}}});//variables: { category: postCategory } }); //, filter: {tags: {contains:"test"}}
        const postsFromAPI = apiData.data.postsByDate.items.filter(post => post.tags.includes(postCategory));
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
        setUnfilteredPosts(postsFromAPI);
        if(postsFromAPI.length !== 0) {
            document.getElementById('contact-suggestion').style.display = 'none'
        } else {
            document.getElementById('contact-suggestion').style.display = 'block'
        }
    }

    useEffect(() => {
        filterBySearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchfilter])

    useEffect(() => {
        document.getElementById("search-input").value = '';
        filterBySearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchterm])

    async function setSearch() {
        //console.log('set search called: ' + document.getElementById("search-input").value)
        setSearchTerm(document.getElementById("search-input").value);
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        document.body.appendChild(field);

        field.style.height = '1px'
        field.style.width = '1px'
        field.style.position = 'absolute';
        field.style.top = '0';
        field.style.left = '0';

        setTimeout(function () {
            field.focus();
            setTimeout(function () {
                field.setAttribute('style', 'display:none;');
                //window.scrollTo(0,0);
            }, 10);
        }, 10);

    }

    function filterBySearch() {
        //console.log('searchterm: ' + searchterm)
        setPosts([])
        if (searchterm !== '') {
            const newPostsArray = unfilteredPosts.filter(post => post.tags.some(tag => tag.includes(searchterm.toLowerCase().replace(/[^a-z0-9]/g, ''))));
            document.getElementById("search-term").innerHTML = `Showing results for "${searchterm}" (${newPostsArray.length} posts found)`;
            document.getElementById("search-info").style.display = 'inline';
            //console.log(newPostsArray)
            setPostsByFilter(newPostsArray);
        } else {
            clearSearch();
        }
    }

    function clearSearch() {
        document.getElementById("search-term").innerHTML = '';
        document.getElementById("search-info").style.display = 'none';
        setSearchTerm('');
        setPostsByFilter(unfilteredPosts);
    }

    function setPostsByFilter(postArray) {
        //console.log('searchfilter: ' + searchfilter)
        if(postArray.length !== 0) {
            document.getElementById('contact-suggestion').style.display = 'none'
        } else {
            document.getElementById('contact-suggestion').style.display = 'block'
        }
        if (searchfilter === 'rel') {
            if (searchterm === '') {
                setPosts([...postArray])
            } else {
                let term = searchterm.toLowerCase().replace(/[^a-z0-9]/g, '');
                let relArray = [];
                /*postArray.forEach(post => {
                    if(post.tags[0].includes(term)) relArray.push(post)
                })*/
                let i = 0;
                while (i < postArray.length) {
                    if (postArray[i].tags[0].includes(term)) {
                        relArray.push(...postArray.splice(i, 1))
                    } else {
                        i += 1
                    }
                }
                function compare(a, b) {
                    if (a.tags[0].indexOf(term) < b.tags[0].indexOf(term)) {
                        return -1;
                    }
                    if (a.tags[0].indexOf(term) > b.tags[0].indexOf(term)) {
                        return 1;
                    }
                    return 0;
                }
                relArray.sort(compare)
                i = 0;
                while (i < postArray.length) {
                    if (postArray[i].tags.includes(term)) {
                        relArray.push(...postArray.splice(i, 1))
                    } else {
                        i += 1
                    }
                }
                setPosts([...relArray, ...postArray])
            }
        } else if (searchfilter === "old") {
            setPosts([...postArray].reverse())
        } else if (searchfilter === "abc") {
            function compare(a, b) {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            }
            setPosts([...postArray].sort(compare))
        } else {
            setPosts([...postArray])
        }
        //console.log('POSTS:')
        //console.log(posts)
    }

    return (
        <div className="App">
            <NavbarComponent />
            <div id="list-head">
                <h1 style={{ fontFamily: 'Signika', color: 'lemonchiffon' }}>{pageTitle}</h1>
                <div id="list-searchbar"><input id="search-input" placeholder={"Search " + pageTitle.toLocaleLowerCase()} /><button id="search-btn" onClick={() => setSearch()}><i className="circle"></i><i className="handle"></i></button></div>
                <div id="filter-info">
                    <div id="search-info"><span id="search-term"></span><button onClick={() => clearSearch()}>Clear &times;</button></div>
                    <div id="filter-options">Sort by:
                        <select id="filter" defaultValue="rel" onChange={e => setSearchFilter(e.target.value)}>
                            <option value="rel">Relevance</option>
                            <option value="new">Date (newest)</option>
                            <option value="old">Date (oldest)</option>
                            <option value="abc">A - Z</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="list-container" style={{ marginBottom: 30 }}>
                {
                    posts.map(post => (
                        <Link to={`/${cat}/${post.id}`} key={post.id || post.title} >
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
                                        <p>{post.description.replace(/<br ?\/>/g, '\n').replace(/<h3>/g, '').replace(/<h4>/g, '').replace(/<\/h3>/g, '').replace(/<\/h4>/g, '').split('.')[0].split('\n')[0].substring(0, 255) + '...'}</p>
                                    </div>
                                </article>
                            </div>
                        </Link>
                    ))
                }
            </div>
            <div id='contact-suggestion'>
                <h4>Not finding what your looking for?</h4>
                <p>Let me know by leaving a suggestion <Link to='/contact'>here</Link>.</p>
            </div>
        </div>
    )

}

