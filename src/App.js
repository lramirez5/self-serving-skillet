import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AdminPanelComponent } from './components/AdminPanelComponent';
import { HomepageComponent } from './components/HomepageComponent'
import { Placeholder } from './components/Placeholder';
import { VideoListComponent } from './components/VideoListComponent';
import { PostComponent } from './components/PostComponent';
import { Error } from './components/Error';
import { PostListComponent } from './components/PostListComponent';

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
        <Route path="/admin" exact>
          <AdminPanelComponent />
        </Route>
        <Route path="/player" exact>
          <VideoListComponent />
        </Route>
        <Route exact path="/Content-Not-Found" component={Error} />
        <Route exact path="/:cat">
          <PostListComponent />
        </Route>
        <Route path="/:cat/:id">
          <PostComponent />
        </Route>
      </Switch>
    </Router>
  );
}
/*
          <Route exact path="/recipes" >
            <ListFoodRecipesComponent />
          </Route>
          <Route path="/recipes/:id">
            <PostComponent />
          </Route>
          <Route path="/drinks" >
            <ListDrinkRecipesComponent />
          </Route>
          <Route path="/drinks/:id">
            <PostComponent />
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
*/
export default App;