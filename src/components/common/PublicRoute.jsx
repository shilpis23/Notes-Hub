// const { useContext } = React;
// const { Navigate } = ReactRouterDOM;
// const { AppContext } = require('../context/AppContext');

import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const { user } = useContext(AppContext);
    return !user ? children : <Navigate to="/search" />;
};

export default PublicRoute;