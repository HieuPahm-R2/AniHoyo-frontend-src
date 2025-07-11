import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import DetailsPage from "../../pages/client/DetailsPage";
import SocialForum from "../../pages/client/SocialForum";
import SingInPage from "../../pages/common/SignIn";
import RegisterPage from "../../pages/common/Register";
import AdminHome from "../../pages/admin/AdminHomepage";
import UserManage from "../../pages/admin/UserManage";
import ProductManage from "../../pages/admin/ProductManage";
import MadContent from "../admin/MadContent";
import MainContent from "../client/main/main";
import "../../assets/styles/main.scss"
import "../../assets/styles/responsive.scss"
import Layout from "../layout/client/layout";
import Error404 from "../errors/404-page";
const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <Error404 />,
      children: [
         {
            index: true,
            element: <MainContent/>
        },
        {
            path: "detail-film",
            element: <DetailsPage/>
        },
         {
            path: "social-community",
            element: <SocialForum/>
        },
      ]
    },
    {
      path: "/admin",
      element: <MadContent/>,
      errorElement: <Error404 />,
      children: [
        {
            index: true,
            element: <AdminHome/>
        },
        {
            path: "table-users",
            element: <UserManage/>
        },
         {
            path: "table-films",
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