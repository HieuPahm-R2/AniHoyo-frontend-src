import React from 'react'

const Header = () => {
    return (
        <header class="header header--static">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="header__content">
                            <button class="header__menu" type="button">
                                <span></span>
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
                                        <li><a href="forgot.html">Forgot password</a></li>
                                        <li><a href="404.html">404 Page</a></li>
                                    </ul>
                                </li>
                            </ul>

                            <div class="header__actions">
                                <form action="#" class="header__form">
                                    <input class="header__form-input" type="text" placeholder="I'm looking for..." />
                                    <button class="header__form-btn" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" /></svg></button>
                                    <button type="button" class="header__form-close"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.3345 0.000183105H5.66549C2.26791 0.000183105 0.000488281 2.43278 0.000488281 5.91618V14.0842C0.000488281 17.5709 2.26186 20.0002 5.66549 20.0002H14.3335C17.7381 20.0002 20.0005 17.5709 20.0005 14.0842V5.91618C20.0005 2.42969 17.7383 0.000183105 14.3345 0.000183105ZM5.66549 1.50018H14.3345C16.885 1.50018 18.5005 3.23515 18.5005 5.91618V14.0842C18.5005 16.7653 16.8849 18.5002 14.3335 18.5002H5.66549C3.11525 18.5002 1.50049 16.7655 1.50049 14.0842V5.91618C1.50049 3.23856 3.12083 1.50018 5.66549 1.50018ZM7.07071 7.0624C7.33701 6.79616 7.75367 6.772 8.04726 6.98988L8.13137 7.06251L9.99909 8.93062L11.8652 7.06455C12.1581 6.77166 12.6329 6.77166 12.9258 7.06455C13.1921 7.33082 13.2163 7.74748 12.9984 8.04109L12.9258 8.12521L11.0596 9.99139L12.9274 11.8595C13.2202 12.1524 13.2202 12.6273 12.9273 12.9202C12.661 13.1864 12.2443 13.2106 11.9507 12.9927L11.8666 12.9201L9.99898 11.052L8.13382 12.9172C7.84093 13.2101 7.36605 13.2101 7.07316 12.9172C6.80689 12.6509 6.78269 12.2343 7.00054 11.9407L7.07316 11.8566L8.93843 9.99128L7.0706 8.12306C6.77774 7.83013 6.77779 7.35526 7.07071 7.0624Z" /></svg></button>
                                </form>

                                <button class="header__search" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" /></svg>
                                </button>

                                <a href="signin.html" class="header__user">
                                    <span>Sign in</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,12a1,1,0,0,0-1-1H11.41l2.3-2.29a1,1,0,1,0-1.42-1.42l-4,4a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l4,4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L11.41,13H19A1,1,0,0,0,20,12ZM17,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V16a1,1,0,0,0-2,0v3a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V5A3,3,0,0,0,17,2Z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Header