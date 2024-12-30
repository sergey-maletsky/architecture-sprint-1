import React, { lazy } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

const AuthControl = lazy(() => import('auth-microfrontend/AuthControl').catch(() => {
        return { default: () => <div className='error'>Component is not available!</div> };
    })
);

const ProfileControl = lazy(() => import('profile-microfrontend/ProfileControl').catch(() => {
        return { default: () => <div className='error'>Component is not available!</div> };
    })
);

const CardsControl = lazy(() => import('cards-microfrontend/CardsControl').catch(() => {
        return { default: () => <div className='error'>Component is not available!</div> };
    })
);

const App = () => (
  <div className="container">
    <AuthControl></AuthControl>
    <ProfileControl></ProfileControl>
    <CardsControl></CardsControl>
  </div>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<App />)