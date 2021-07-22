import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ListFoodRecipesComponent } from './components/ListFoodRecipesComponent';
import { ListDrinkRecipesComponent } from './components/ListDrinkRecipesComponent';
import { ListBlogPostsComponent } from './components/ListBlogPostsComponent';
import { AdminPanelComponent } from './components/AdminPanelComponent';
import { HomepageComponent } from './components/HomepageComponent'
import {Placeholder} from './components/Placeholder';

function App() {
    return (
        <div>
            <Router>
                <div className="container">
                    <Switch>
                        <Route path="/" exact>
                          <Placeholder />
                        </Route>
                        <Route path="/temp" exact>
                          <HomepageComponent />
                        </Route>
                        <Route path="/recipes" exact>
                          <ListFoodRecipesComponent />
                        </Route>
                        <Route path="/drinks" exact>
                          <ListDrinkRecipesComponent />
                        </Route>
                        <Route path="/blog" exact>
                          <ListBlogPostsComponent />
                        </Route>
                        <Route path="/admin" exact>
                          <AdminPanelComponent />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>

    );
}

export default App;