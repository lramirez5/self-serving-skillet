import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ListFoodRecipesComponent } from './components/ListFoodRecipesComponent';
import { ListDrinkRecipesComponent } from './components/ListDrinkRecipesComponent';
import { ListBlogPostsComponent } from './components/ListBlogPostsComponent';
import { AdminPanelComponent } from './components/AdminPanelComponent';
import { HomepageComponent } from './components/HomepageComponent'
import { Placeholder } from './components/Placeholder';
import { VideoListComponent } from './components/VideoListComponent';
import { PostComponent } from './components/PostComponent';
import {Error} from './components/Error';

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/" exact>
            <Placeholder />
          </Route>
          <Route path="/temp" exact>
            <HomepageComponent />
          </Route>
          <Route exact path="/recipes" >
            <ListFoodRecipesComponent />
          </Route>
          <Route path="/recipes/:id">
            <PostComponent />
          </Route>
          <Route path="/drinks" >
            <ListDrinkRecipesComponent />
          </Route>
          <Route path="/blog" >
            <ListBlogPostsComponent />
          </Route>
          <Route path="/admin" exact>
            <AdminPanelComponent />
          </Route>
          <Route path="/player" exact>
            <VideoListComponent />
          </Route>
          <Route component={Error} />
        </Switch>
    </Router>

  );
}

export default App;