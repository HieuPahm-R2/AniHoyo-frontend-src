import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { runLogoutAction } from '../../context/slice/accountSlice';
import { LogoutAPI } from '@/config/api.handle';
import { Avatar, Dropdown, Menu, message, Space } from 'antd';
import { AppstoreOutlined, DownOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { VscSearchFuzzy } from 'react-icons/vsc';

const Header = (props) => {
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
    const items2 = [
        {
            label: 'Dạng Anime',
            key: 'mail',
            icon: <MailOutlined />,
            children: [
                {
                    type: 'group',
                    label: 'Item 1',
                    children: [
                        { label: 'Option 1', key: 'setting:1' },
                        { label: 'Option 2', key: 'setting:2' },
                    ],
                },
                {
                    type: 'group',
                    label: 'Item 2',
                    children: [
                        { label: 'Option 3', key: 'setting:3' },
                        { label: 'Option 4', key: 'setting:4' },
                    ],
                },
            ],
        },
        {
            label: 'TOP ANIME THEO MÙA',
            key: 'app',
            icon: <AppstoreOutlined />,
            disabled: true,
        },
        {
            label: 'THỂ LOẠI / MÙA PHIM',
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                {
                    type: 'group',
                    label: 'Item 1',
                    children: [
                        { label: 'Option 1', key: 'setting:1' },
                        { label: 'Option 2', key: 'setting:2' },
                    ],
                },
                {
                    type: 'group',
                    label: 'Item 2',
                    children: [
                        { label: 'Option 3', key: 'setting:3' },
                        { label: 'Option 4', key: 'setting:4' },
                    ],
                },
            ],
        },
        {
            key: 'alipay',
            label: (
                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                    about us
                </a>
            ),
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

                            <Menu mode="horizontal" items={items2} />;
                            <div className='page-header__logo'>
                                <span className='logo' onClick={() => navigate('/')}>
                                    <VscSearchFuzzy className='icon-search' />
                                </span>
                                <input
                                    className="input-search" type={'text'}
                                    placeholder="Bạn xem gì hôm nay..."
                                    onChange={(e) => props.setSearchTerm(e.target.value)}
                                />
                            </div>

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