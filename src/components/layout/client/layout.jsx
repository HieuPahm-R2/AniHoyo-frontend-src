import React from 'react'
import ClientHeader from '../../client/header/clientHeader'
import ClientFooter from '../../client/footer/clientFooter'
import { Outlet } from "react-router-dom";
import "../../client/main/mainStyles.scss";
const Layout = () => {
  return (
    <div className='god-overrall'>
        <ClientHeader/>
        <Outlet/>
        <ClientFooter/>
    </div>
  )
}

export default Layout