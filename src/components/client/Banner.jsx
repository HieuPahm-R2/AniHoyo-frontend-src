import React from 'react'
import { FaStar } from "react-icons/fa";
import { IoIosPlayCircle } from "react-icons/io";
const Banner = () => {
    return (
        <div className='banner-container' >
            <img src="/summer2025.jpg" alt="" className="bg-film" />
            <div className="content-view">
                <h1 className="content-title">Nhà có Năm Nàng Dâu - Final Season</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, qui!
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro, impedit.
                </p>
                <div className="content-details">
                    <h6 className="cotent-studio">Studio: CloverWorks</h6>
                    <h5 className="content-tags">Romance, School life</h5>
                    <h4 className="content-releaseDate">2024</h4>
                    <h3 className="content-rates">
                        <span>IDMB</span><FaStar /> 9.9
                    </h3>
                </div>
                <div className="btn-action">
                    <a href="#">
                        <IoIosPlayCircle className="play-btn" />
                        <span> Xem ngay</span>
                    </a>
                </div>
            </div>
        </div >
    )
}

export default Banner