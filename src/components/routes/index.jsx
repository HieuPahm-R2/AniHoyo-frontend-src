import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import DetailsPage from "../../pages/client/DetailsPage";
import SocialForum from "../../pages/client/SocialForum";
import SingInPage from "../../pages/common/SignIn";
import RegisterPage from "../../pages/common/Register";
import AdminHome from "../../pages/admin/AdminHomepage";
import UserManage from "../../pages/admin/UserManage";
import ProductManage from "../../pages/admin/ProductManage";
import MainContent from "../admin/MainContent";
import "../../assets/styles/main.scss"
import "../../assets/styles/responsive.scss"
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: ":explore/:id",
            element: <DetailsPage/>
        },
         {
            path: ":explore",
            element: <SocialForum/>
        },
      ]
    },
    {
      path: "/admin",
      element: <MainContent/>,
      children: [
        {
            index: true,
            element: <AdminHome/>
        },
        {
            path: "user",
            element: <UserManage/>
        },
         {
            path: "film-movie",
            element: <ProductManage/>
        },
      ]
    },
    {
      path: "/signup",
      element: <RegisterPage/>,
    },
    {
      path: "/login",
      element: <SingInPage/>,
    },
]);
export default router