import { createBrowserRouter } from "react-router-dom";
import Username from "../components/Username";
import Register from '../components/Register';
import Password from '../components/Password';
import Profile from '../components/Profile';
import Reset from '../components/Reset';
import Recovery from '../components/Recovery';
import PageNotFound from '../components/PageNotFound';
import { AuthorizeUser, ProtectRoute } from '../middleware/auth';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Username />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/password",
      element: <ProtectRoute><Password /></ProtectRoute>,
    },
    {
      path: "/profile",
      element: (
      <AuthorizeUser> <Profile /></AuthorizeUser>
      ),
    },
    {
      path: "/reset",
      element: <Reset />,
    },
    {
      path: "/Recovery",
      element: <Recovery />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  export default router;