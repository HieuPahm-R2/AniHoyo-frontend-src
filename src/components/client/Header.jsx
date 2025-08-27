import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { runLogoutAction } from '../../context/slice/accountSlice';
import { LogoutAPI } from '@/config/api-handle';
import { Avatar, Dropdown, message, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);

    let items = [
        {
            label: <label>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label>Đăng xuất</label>,
            key: 'logout',
        },
    ];

    if (user?.role.name === "ADMIN") {
        items.unshift({
            label: <label>Administrator Dashboard</label>,
            key: 'admin',
        })
    }
    const handleMenuClick = ({ key }) => {
        if (key === 'account') setIsModalOpen(true);
        if (key === 'admin') navigate('/admin');
        if (key === 'logout') handleLogout();
    }
    const handleLogout = async () => {
        await LogoutAPI();
        console.log("Logout clicked");
        dispatch(runLogoutAction());
        message.success("Logout successfully");
        navigate("/")

    }
    // link to access avatar
    const urlAvatarTemp = `${import.meta.env.VITE_BACKEND_URL}/storage/temp/user33.svg`;
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user?.avatar}`;
    return (
        <header class="header header--static">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="header__content">
                            <button class="header__menu" type="button">
                                <span></span>
                            </button>

                            <a href="/" class="header__logo">
                                <img src="/CloverWorks.svg" alt="Movies & TV Shows, Online cinema" />
                            </a>

                            <ul class="header__nav">
                                <li class="header__nav-item">
                                    <a class="header__nav-link" href="#" role="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Trang chủ </a>
                                </li>
                                <li class="header__nav-item">
                                    <a class="header__nav-link" href="#" role="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Thể Loại Phim </a>

                                    <ul class="dropdown-menu header__nav-menu" aria-labelledby="dropdownMenu1">
                                        <li><a href="catalog.html">Catalog</a></li>
                                        <li class="dropdown-submenu">
                                            <a class="dropdown-item" href="#" role="button" id="dropdownMenuSub" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Catalog dropdown <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.93893 3.30334C1.08141 3.30334 0.384766 2.60669 0.384766 1.75047C0.384766 0.894254 1.08141 0.196308 1.93893 0.196308C2.79644 0.196308 3.49309 0.894254 3.49309 1.75047C3.49309 2.60669 2.79644 3.30334 1.93893 3.30334Z" /></svg></a>
                                            <ul class="dropdown-menu header__nav-menu" aria-labelledby="dropdownMenuSub">
                                                <li><a href="category.html">Actions</a></li>
                                                <li><a href="category.html">Biography</a></li>
                                                <li><a href="category.html">Documentary</a></li>
                                                <li><a href="category.html">Horror</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="category.html">Category style 1</a></li>
                                        <li><a href="category2.html">Category style 2</a></li>
                                        <li><a href="details.html">Details style 1</a></li>
                                    </ul>
                                </li>
                                <li class="header__nav-item">
                                    <a class="header__nav-link header__nav-link--live" href="live.html">Phim sắp chiếu<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="4" r="4" fill="#EB5757" fill-opacity="0.5" /><g filter="url(#filter0_d)"><circle cx="6" cy="4" r="2" fill="#EB5757" /></g><defs><filter id="filter0_d" x="0" y="0" width="12" height="12" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix" /><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" /><feOffset dy="2" /><feGaussianBlur stdDeviation="2" /><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" /><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" /><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" /></filter></defs></svg></a>
                                </li>
                                <li class="header__nav-item">
                                    <a class="header__nav-link header__nav-link--live" href="live.html">Social Forum<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="4" r="4" fill="#EB5757" fill-opacity="0.5" /><g filter="url(#filter0_d)"><circle cx="6" cy="4" r="2" fill="#EB5757" /></g><defs><filter id="filter0_d" x="0" y="0" width="12" height="12" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix" /><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" /><feOffset dy="2" /><feGaussianBlur stdDeviation="2" /><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" /><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" /><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" /></filter></defs></svg></a>
                                </li>

                                <li class="header__nav-item">
                                    <a class="header__nav-link header__nav-link--more" href="#" role="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.93893 14.3033C6.08141 14.3033 5.38477 13.6067 5.38477 12.7505C5.38477 11.8943 6.08141 11.1963 6.93893 11.1963C7.79644 11.1963 8.49309 11.8943 8.49309 12.7505C8.49309 13.6067 7.79644 14.3033 6.93893 14.3033Z" /><path d="M12.7501 14.3033C11.8926 14.3033 11.1959 13.6067 11.1959 12.7505C11.1959 11.8943 11.8926 11.1963 12.7501 11.1963C13.6076 11.1963 14.3042 11.8943 14.3042 12.7505C14.3042 13.6067 13.6076 14.3033 12.7501 14.3033Z" /><path d="M18.5608 14.3033C17.7032 14.3033 17.0066 13.6067 17.0066 12.7505C17.0066 11.8943 17.7032 11.1963 18.5608 11.1963C19.4183 11.1963 20.1149 11.8943 20.1149 12.7505C20.1149 13.6067 19.4183 14.3033 18.5608 14.3033Z" /></svg>
                                    </a>

                                    <ul class="dropdown-menu header__nav-menu header__nav-menu--scroll" aria-labelledby="dropdownMenu3">
                                        <li><a href="about.html">About us</a></li>
                                        <li><a href="privacy.html">Privacy policy</a></li>
                                    </ul>
                                </li>
                            </ul>

                            <div class="header__actions">

                                {!isAuthenticated ?
                                    <Link to={"/login"} class="header__user">
                                        <span>Sign in</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,12a1,1,0,0,0-1-1H11.41l2.3-2.29a1,1,0,1,0-1.42-1.42l-4,4a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l4,4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L11.41,13H19A1,1,0,0,0,20,12ZM17,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V16a1,1,0,0,0-2,0v3a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V5A3,3,0,0,0,17,2Z" /></svg>
                                    </Link>
                                    :
                                    <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} >
                                        <a style={{ color: "white", cursor: "pointer" }} onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={user?.avatar ? urlAvatar : urlAvatarTemp} />
                                                Welcome_{user?.name}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Header