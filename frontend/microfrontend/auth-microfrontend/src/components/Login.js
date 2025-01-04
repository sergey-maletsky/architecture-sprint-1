import React from 'react';

import * as auth from "../utils/auth.js";
import '../styles/login/login.css';

function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [tooltipStatus, setTooltipStatus] = React.useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const userData = {
            email,
            password
        }
        onLogin(userData);
    }

    function onLogin({ email, password }) {
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
        // при вызове обработчика onSignOut происходит удаление jwt
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        history.push("/signin");
    }

    return (
        <div className="auth-form">
            <form className="auth-form__form" onSubmit={handleSubmit}>
                <div className="auth-form__wrapper">
                    <h3 className="auth-form__title">Вход</h3>
                    <label className="auth-form__input">
                        <input type="text" name="name" id="email"
                               className="auth-form__textfield" placeholder="Email"
                               onChange={e => setEmail(e.target.value)} required  />
                    </label>
                    <label className="auth-form__input">
                        <input type="password" name="password" id="password"
                               className="auth-form__textfield" placeholder="Пароль"
                               onChange={e => setPassword(e.target.value)} required  />
                    </label>
                </div>
                <button className="auth-form__button" type="submit">Войти</button>
            </form>
        </div>
    )
}

export default Login;
