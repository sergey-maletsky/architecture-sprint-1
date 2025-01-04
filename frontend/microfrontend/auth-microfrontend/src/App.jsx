import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./index.css";

const App = () => (
    <Router>
        <div className="container">
            <Switch>
                <Route path="/signin">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Register />
                </Route>
                <Route path="/">
                    <div>
                        <h1>Welcome to auth-microfrontend</h1>
                        <p>Please navigate to /signin or /signup for authentication.</p>
                    </div>
                </Route>
            </Switch>
        </div>
    </Router>
);

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);