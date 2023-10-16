import React, {Children, useContext} from "react";
import {
    BrowserRouter as Routers,
    Route,
    Routes,
    Navigate,
} from "react-router-dom"

import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login-page/login-page';

import { AuthProvider, AuthContext } from "./contexts/auth";
import SignupPage from "./pages/signup-page/signup-page";


const AppRoutes = () => {

    const Private = ({children}) => {
        const {authenticated, loading} = useContext(AuthContext);

        if (loading) {
            return <div> Carregando...</div>;
        }

        if(!authenticated) {
            return <Navigate to="/login"/>
            console.log({authenticated})
        } 
        return children;
    };

    return (
        <Routers>
            <AuthProvider>
                <Routes>
                    <Route exact path="/login" element={<LoginPage/>} />
                    
                    <Route exact path="/signup" element={<SignupPage/>} />

                    <Route exact 
                        path="/" 
                        element={
                        <Private>
                            <HomePage/> 
                        </Private>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Routers> 
    )
}

export default AppRoutes;