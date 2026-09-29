import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchAccount, runLoginAction } from './context/slice/accountSlice.ts';
import Loading from "./components/share/reloading/Loading.jsx";
import { useAppDispatch } from "./context/hooks.ts";
import { handleRefreshToken } from "./config/axios.customize";

function App() {
  const dispatch = useAppDispatch()
  const isLoading = useSelector(state => state.account.isLoading)

  useEffect(() => {
    const path = window.location.pathname;
    (async () => {
      // Cookie refresh-token (httpOnly) có thể vẫn còn hạn trong khi access_token
      // trong localStorage đã mất/hết hạn. GET /auth/account nằm trong whitelist
      // permitAll nên nó trả 200 { user: null } chứ không trả 401 — vì vậy phải
      // chủ động đổi token trước khi kết luận là hết phiên.
      //
      // Chạy ở MỌI route, kể cả /login và /sign-up: trước đây hai route này bị
      // return sớm nên đứng ở trang đăng nhập sẽ không có request /auth/refresh
      // nào cả, dù cookie còn hạn — người dùng buộc phải đăng nhập lại bằng tay.
      let token = localStorage.getItem('access_token');
      if (!token) {
        token = await handleRefreshToken();
        // [debug auth] xoá được sau khi xác nhận luồng chạy
        console.info('[auth] bootstrap: không có access_token trong localStorage → gọi /auth/refresh:',
          token ? 'OK, đã lấy token mới' : 'THẤT BẠI (cookie hết hạn hoặc không gửi được)');
      }

      let user = null;
      try {
        user = (await dispatch(fetchAccount()).unwrap())?.user ?? null;
      } catch (error) {
        console.warn('[auth] fetchAccount lỗi:', error); // [debug auth]
      }

      // Đang ở trang đăng nhập mà khôi phục được phiên → vào thẳng trang chủ.
      if (user && (path === '/login' || path === '/sign-up')) {
        router.navigate('/', { replace: true });
      }
    })();
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
