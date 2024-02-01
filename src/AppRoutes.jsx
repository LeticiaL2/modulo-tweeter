import React, { useContext } from "react";
import {
  BrowserRouter as Routers,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/home-page/home-page";
import LoginPage from "./pages/login-page/login-page";
import DetailsPage from "./pages/details-page/details-page";
import SignupPage from "./pages/signup-page/signup-page";

import { AuthProvider, AuthContext } from "./contexts/auth";
import TimeLineProvider from "./contexts/tweetsHomePageContext";
import TweetsDetailsProvider from "./contexts/tweetsDetailsContext";
import LanguageProvider from "./contexts/languageContext";

const AppRoutes = () => {
  const Private = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
      return <div>Carregando...</div>;
    }

    if (!authenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  return (
    <Routers>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route exact path="login" element={<LoginPage />} />

            <Route exact path="signup" element={<SignupPage />} />

            <Route
              exact
              path="/"
              element={
                <Private>
                  <TimeLineProvider>
                    <HomePage />
                  </TimeLineProvider>
                </Private>
              }
            />

            <Route
              exact
              path="tweets/:id/detalhes"
              element={
                <Private>
                  <TweetsDetailsProvider>
                    <DetailsPage />
                  </TweetsDetailsProvider>
                </Private>
              }
            />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Routers>
  );
};

export default AppRoutes;