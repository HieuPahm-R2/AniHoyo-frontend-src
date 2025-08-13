import { RouterProvider } from "react-router-dom";
import router from "./components/routes/index.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { callFetchAccountAPI } from "./services/api-handle.js";
import { runGetAccountAction, runLoginAction } from './context/account/accountSlice';

function App() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)

  const fetchAccount = async () => {
    if (window.location.pathname == "/login" || window.location.pathname == "/register") return;
    const res = await callFetchAccountAPI();
    if (res.data) {
      dispatch(runGetAccountAction(res.data));
    }
  }
  useEffect(() => {
    fetchAccount()
  }, [])
  return (
    <>
      {
        isAuthenticated === true || window.location.pathname === '/login' || window.location.pathname === '/register'
          || window.location.pathname === '/'
          ? <RouterProvider router={router} /> : <Loading />
      }
    </>
  );
}

export default App;
