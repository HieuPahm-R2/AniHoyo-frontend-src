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
    
    // Chỉ gọi API account khi có access token
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Nếu không có token, redirect to login
      window.location.href = '/login';
      return;
    }
    
    try {
      const res = await callFetchAccountAPI();
      if (res.data) {
        dispatch(runGetAccountAction(res.data));
      }
    } catch (error) {
      console.error('Error fetching account:', error);
      // Nếu có lỗi, xóa token và redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
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
