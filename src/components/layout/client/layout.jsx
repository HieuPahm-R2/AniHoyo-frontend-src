import React from 'react'
import { Outlet } from "react-router-dom";
import Header from '../../client/Header';
import Footer from '../../client/Footer';

const Layout = () => {
  return (
    <div className='god-overrall'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout