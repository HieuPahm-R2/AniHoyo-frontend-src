import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import DetailsPage from "../../pages/client/DetailsPage";
import SocialForum from "../../pages/client/SocialForum";
import SingInPage from "../../pages/auth/SignIn";
import RegisterPage from "../../pages/auth/Register";
import AdminHome from "../../pages/admin/AdminHomepage";
import UserManage from "../../pages/admin/UserManage";
import ProductManage from "../../pages/admin/ProductManage";
import MadContent from "../layout/admin/MadContent";
import "../../assets/styles/mainClient.scss"
import Layout from "../layout/client/layout";
import Error404 from "../errors/404-page";
import ClientHome from "../../pages/client/ClientHomepage";
import ProtectedRoute from "../protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <ClientHome />
      },
      {
        path: "/detail/:slug",
        element: <ProtectedRoute>
          <DetailsPage />
        </ProtectedRoute>
      },
      {
        path: "social-community",
        element: <SocialForum />
      },
    ]
  },
  {
    path: "/admin",
    element: <MadContent />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <ProtectedRoute>
          <AdminHome />
        </ProtectedRoute>
      },
      {
        path: "table-users",
        element: <ProtectedRoute>
          <UserManage />
        </ProtectedRoute>
      },
      {
        path: "table-films",
        element: <ProtectedRoute>
          <ProductManage />
        </ProtectedRoute>
      },
    ]
  },
  {
    path: "/sign-up",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <SingInPage />,
  },
]);
export default router