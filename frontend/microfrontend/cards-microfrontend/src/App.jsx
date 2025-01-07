import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import Main from "./components/Main";
import AddPlacePopup from "./components/AddPlacePopup";
import ImagePopup from "./components/ImagePopup";
import api from "./utils/api";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import PopupWithForm from "./components/PopupWithForm";
import { useHistory } from 'react-router-dom';

import "./index.css";

const ProfileButtons = lazy(() => import('profile-microfrontend/ProfileButtons'));

const App = () => {

    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
    const history = useHistory();

    useEffect(() => {
        api.getAppInfo()
            .then(([cardData, userData]) => {
                setCards(cardData);
                setCurrentUser(userData);
            })
            .catch((err) => {
                history.push("/signin")
                console.log(err)
            });
    }, [setCurrentUser, history]);


    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api
            .changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api
            .removeCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(newCard) {
        api
            .addCard(newCard)
            .then((newCardFull) => {
                setCards([newCardFull, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <h2>Cards Microfrontend</h2>
            <button onClick={handleAddPlaceClick}>Добавить место</button>
            <Suspense fallback={<div>Loading...</div>}>
                <ProfileButtons/>
            </Suspense>
            <Main
                cards={cards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
            />
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleAddPlaceSubmit}
                onClose={closeAllPopups}
            />
            <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </CurrentUserContext.Provider>
    );
};

export default App;