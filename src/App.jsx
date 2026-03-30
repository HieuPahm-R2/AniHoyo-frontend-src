import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchAccount, runLoginAction } from './context/slice/accountSlice.ts';
import Loading from "./components/share/reloading/Loading.jsx";
import { useAppDispatch } from "./context/hooks.ts";

function App() {
  const dispatch = useAppDispatch()
  const isLoading = useSelector(state => state.account.isLoading)

  useEffect(() => {
    if (window.location.pathname === '/login') return;
    if (window.location.pathname === '/sign-up') return;
    dispatch(fetchAccount())
  }, [])
  return (
    <>
      {
        isLoading === false || window.location.pathname === '/login' || window.location.pathname === '/sign-up'
          ? <RouterProvider router={router} /> : <Loading />
      }
    </>
  );
}

export default App;
