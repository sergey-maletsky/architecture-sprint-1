import React, { useState, useContext, useEffect } from 'react';
import EditProfilePopup from './components/EditProfilePopup';
import EditAvatarPopup from './components/EditAvatarPopup';
import api from "./utils/api";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import { useHistory } from 'react-router-dom';

import "./index.css";

const ProfileApp = () => {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        useState(false);
    // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
    const [currentUser, setCurrentUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        api
            .getUserInfo()
            .then((userData) => {
                setCurrentUser(userData);
            })
            .catch((err) => {
                history.push("/signin")
                console.log(err)
            });
    }, [history, setCurrentUser]);

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }
    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
    }

    function handleUpdateUser(userUpdate) {
        api
            .setUserInfo(userUpdate)
            .then((newUserData) => {
                setCurrentUser(newUserData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUpdate) {
        api
            .setUserAvatar(avatarUpdate)
            .then((newUserData) => {
                setCurrentUser(newUserData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }
    return (
        <CurrentUserContext.Provider value={currentUser}>
            <h2>Profile Microfrontend</h2>
            <button onClick={handleEditProfileClick}>Редактировать профиль</button>
            <button onClick={handleEditAvatarClick}>Редактировать аватар</button>
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onUpdateUser={handleUpdateUser}
                onClose={closeAllPopups}
            />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onUpdateAvatar={handleUpdateAvatar}
                onClose={closeAllPopups}
            />
        </CurrentUserContext.Provider>
    );
};

export default ProfileApp;