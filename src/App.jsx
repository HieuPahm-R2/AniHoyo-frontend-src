import { RouterProvider } from "react-router-dom";
import router from "./components/routes/index.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { callFetchAccountAPI } from "./config/api.handle.js";
import { fetchAccount, runLoginAction } from './context/slice/accountSlice.ts';
import Loading from "./components/share/reloading/Loading.jsx";

function App() {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.account.isLoading)

  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
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
