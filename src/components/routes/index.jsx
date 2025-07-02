import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import DetailsPage from "../../pages/client/DetailsPage";
import SocialForum from "../../pages/client/SocialForum";

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
]);
export default router