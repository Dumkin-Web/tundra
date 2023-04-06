import Auth from "../pages/Auth"
import DialogsPage from "../pages/DialogPage/DialogsPage"
import Main from "../pages/Main"
import MyTasks from "../pages/MyTasks"
import ProjectPage from "../pages/ProjectPage"
import ProjectList from "../pages/ProjectsList"
import UserPage from "../pages/UserPage/UserPage"
import { DIALOGS_ROUTE, MAIN_ROUTE, MY_TASKS_ROUTE, PROJECT_LIST_ROUTE, PROJECT_ROUTE, PROJECT_SETTINGS_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, USER_ROUTE } from "./consts"

export const authRoutes = [
    {
        path: PROJECT_LIST_ROUTE,
        Element: <ProjectList />
    },
    {
        path: PROJECT_ROUTE + "/:projectId",
        Element: <ProjectPage />
    },
    {
        path: PROJECT_SETTINGS_ROUTE + '/:projectId',
        Element: <ProjectPage />
    },
    {
        path: MY_TASKS_ROUTE,
        Element: <MyTasks />
    },
    {
        path: DIALOGS_ROUTE,
        Element: <DialogsPage />
    },
    {
        path: USER_ROUTE,
        Element: <UserPage />
    },
]

export const publicRoutes = [
    {
    path: MAIN_ROUTE,
    Element: <Main />
    },
    {
        path: SIGN_IN_ROUTE,
        Element: <Auth />
    },
    {
        path: SIGN_UP_ROUTE,
        Element: <Auth />
    },
]

// export const notAuthRoutes = [
//     {
//         path: SIGN_IN_ROUTE,
//         Element: <Auth />
//     },
//     {
//         path: SIGN_UP_ROUTE,
//         Element: <Auth />
//     },
// ]

// {
//     path: ,
//     Element: 
// },