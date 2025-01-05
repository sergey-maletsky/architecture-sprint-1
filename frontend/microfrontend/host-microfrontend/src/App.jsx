import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { CurrentUserContext } from './contexts/CurrentUserContext';

import "./index.css";

const AuthModule = lazy(() =>
    import('auth-microfrontend/AuthApp').catch(() => <div>Error loading Auth Module</div>)
);
const CardsModule = lazy(() =>
    import('cards-microfrontend/CardsApp').catch(() => <div>Error loading Cards Module</div>)
);

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false); // Для хранения состояния авторизации
    const [loading, setLoading] = useState(true);   // Для отображения состояния загрузки

    useEffect(() => {
        // Динамическая загрузка isLoggedIn
        const loadIsLoggedIn = async () => {
            setLoading(true); // Показываем состояние загрузки
            try {
                const { default: isLoggedIn } = await import('auth-microfrontend/isLoggedIn');
                const result = await isLoggedIn(); // Получаем результат вызова
                setLoggedIn(result); // Устанавливаем состояние авторизации
            } catch (error) {
                console.error("Error loading isLoggedIn:", error);
                setLoggedIn(false); // На случай ошибки
            } finally {
                setLoading(false); // Убираем состояние загрузки
            }
        };

        loadIsLoggedIn();
    }, []);

    if (loading) {
        // Пока идет загрузка, можно показывать сообщение
        return <div>Loading...</div>;
    }

    return (
        <CurrentUserContext.Provider value={{}}>
            <BrowserRouter>
                <div className="page__content">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route path="/signin">
                                <AuthModule/>
                            </Route>
                            <Route path="/signup">
                                <AuthModule/>
                            </Route>
                            <ProtectedRoute
                                exact
                                path="/"
                                component={CardsModule}
                                loggedIn={loggedIn}
                            />
{/*                            <Route path="/profile">
                                <ProfileModule />
                            </Route>*/}
                        </Switch>
                    </Suspense>
                    <Footer />
                </div>
            </BrowserRouter>
        </CurrentUserContext.Provider>
    );
};

export default App;