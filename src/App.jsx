import { RouterProvider } from "react-router-dom";
import router from "./components/routes/index.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { callFetchAccountAPI } from "./services/api-handle.js";
import { runGetAccountAction, runLoginAction } from './context/account/accountSlice';
import Loading from "./components/reloading/index.jsx";

function App() {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.account.isLoading)

  const fetchAccount = async () => {
    if (window.location.pathname == "/login" || window.location.pathname == "/sign-up") return;
    try {
      const res = await callFetchAccountAPI();
      if (res.data) {
        dispatch(runGetAccountAction(res.data));
      }
    } catch (error) {
      window.location.href = '/login';
      // Có thể log hoặc xử lý chuyển hướng nếu cần
      // console.error(error);
    }
  }

  useEffect(() => {
    fetchAccount()
  }, [])
  return (
    <>
      {
        isLoading === false || window.location.pathname === '/login' || window.location.pathname === '/register'
          || window.location.pathname === '/'
          ? <RouterProvider router={router} /> : <Loading />
      }
    </>
  );
}

export default App;
