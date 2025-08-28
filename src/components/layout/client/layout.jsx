import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import Header from '../../client/Header';
import Footer from '../../client/Footer';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className='god-overrall'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout