import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import InfoTooltip from "./components/InfoTooltip";
import Header from "./components/Header";
import * as auth from "./utils/auth.js";
import "./index.css";

const App = () => {
    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
    const [tooltipStatus, setTooltipStatus] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            auth
                .checkToken(token)
                .then((res) => {
                    setEmail(res.data.email);
                    setIsLoggedIn(true);
                    history.push("/");
                })
                .catch((err) => {
                    localStorage.removeItem("jwt");
                    console.log(err);
                });
        }
    }, [history]);

    function onRegister({email, password}) {
        auth
            .register(email, password)
            .then((res) => {
                setTooltipStatus("success");
                setIsInfoToolTipOpen(true);
                history.push("/signin");
            })
            .catch((err) => {
                setTooltipStatus("fail");
                setIsInfoToolTipOpen(true);
            });
    }

    function onLogin({email, password}) {
        auth
            .login(email, password)
            .then((res) => {
                setIsLoggedIn(true);
                setEmail(email);
                history.push("/");
            })
            .catch((err) => {
                setTooltipStatus("fail");
                setIsInfoToolTipOpen(true);
            });
    }

    function onSignOut() {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        history.push("/signin");
    }

    function closeAllPopups() {
        setIsInfoToolTipOpen(false);
    }

    return (
        <div>
            <Header email={email} onSignOut={onSignOut} />
            <h2>Auth Microfrontend</h2>
            <Switch>
                <Route path="/signin">
                    <Login onLogin={onLogin} />
                </Route>
                <Route path="/signup">
                    <Register onRegister={onRegister} />
                </Route>
            </Switch>
            <InfoTooltip
                isOpen={isInfoToolTipOpen}
                onClose={closeAllPopups}
                status={tooltipStatus}
            />
        </div>
    );
};

export default App;