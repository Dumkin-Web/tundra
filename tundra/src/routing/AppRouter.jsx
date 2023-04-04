import React from "react"
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { authRoutes, publicRoutes } from "./routes";

const AppRouter = () => {

    const isAuth = useSelector(state => state.user.isAuth)

    return (
        <Routes>
            {isAuth && authRoutes.map(({path, Element}) => {
                return <Route key={path} path={path} element={Element} />
            })}

            {/* {!isAuth && notAuthRoutes.map(({path, Element}) => {
                return <Route key={path} path={path} element={Element} />
            })} */}

            {publicRoutes.map(({path, Element}) => {
                return <Route key={path} path={path} element={Element} />
            })}

            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    )
};

export default AppRouter;
