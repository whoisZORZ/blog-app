import './App.css';
import { BrowserRouter, NavLink, Route, Redirect, Switch } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { ViewAllPosts } from "./components/ViewAllPosts.jsx";
import { ViewSinglePost } from "./components/ViewSinglePost.jsx";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Blog alkalmazás</title>
        <meta name="description" content="Blog alkalmazás" />
      </Helmet>
      <BrowserRouter>
        <nav className="navbar sticky-top navbar-fixed navbar-expand-sm navbar-dark bg-dark mb-3">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to={`/`} activeClassName="active">
                  <span className="nav-link">Blog alkalmazás</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/posts" exact component={ViewAllPosts} />
          <Route path="/posts/:id" component={ViewSinglePost} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
