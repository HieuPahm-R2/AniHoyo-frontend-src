import { FaStar } from "react-icons/fa";
import { IoIosPlayCircle } from "react-icons/io";
import { NavLink } from "react-router-dom";
import "./clientHeader.scss"

const ClientHeader = () => {
  const navigation = [
    {
      label: "Top Anime",
      href: "topAnime"
    },
     {
      label: "Dạng anime",
      href: "dangAnime"
    },
    {
      label: "Season",
      href: "seasonfilm"
    },
    {
      label: "Lịch chiếu",
      href: "lichchieuphim"
    },
    {
      label: "Forum",
      href: "socialforum"
    },
  ]
  return(
     <header className='header-container'>
       <img src="/summer2025.jpg" className="bg-film" alt="" />
        <nav>
          <div className='logo_ul'>
              <img className="icon-app" src="/CloverWorks.svg" alt="" />
              <ul>
                {
                  navigation.map((nav, index) => {
                    return(
                      <li>
                        <NavLink key={nav.label} to={nav.href}>{nav.label}</NavLink>
                      </li>
                    )
                  })
                }
              </ul>
          </div>
          <div className="search-film">
            <input type="text" id="search-input" placeholder="Tìm kiếm phim ..." />
            <img src="/user-solid.svg" className="user-account"></img>
            <div className="search-suggest">
              <a href="#" className="card-item">
                <img src="/sug-1.webp" alt="" />
                <div className="info-film">
                  <h3 className="title-film">Hibike! Euphonium 3</h3>
                  <p className="desc-film">Comedy, Slice of life, 2023<span className="tag-film">IMDB</span><FaStar />9.6</p>
                </div>
              </a>
              <a href="#" className="card-item">
                <img src="/sug-1.webp" alt="" />
                <div className="info-film">
                  <h3 className="title-film">Hibike! Euphonium 3</h3>
                  <p className="desc-film">Comedy, Slice of life, 2023<span className="tag-film">IMDB</span><FaStar />9.6</p>
                </div>
              </a>
              <a href="#" className="card-item">
                <img src="/sug-1.webp" alt="" />
                <div className="info-film">
                  <h3 className="title-film">Hibike! Euphonium 3</h3>
                  <p className="desc-film">Comedy, Slice of life, 2023<span className="tag-film">IMDB</span><FaStar />9.6</p>
                </div>
              </a>
           
            </div>
          </div>
        </nav>
        <div className="content-view">
          <h1 className="content-title">Nhà có Năm Nàng Dâu - Final Season</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, qui!</p>
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
          <section className="item-popular">
            <h3 className="intro" >Top Trending</h3>
            <div className="cards-list">
              <a href="#" className="card-film">
                <img src="/violet-movie.jpg" alt="" className="card-poster" />
                <span className="card-star"><FaStar /> 9.7</span>
                <span className="card-episode">Full</span>
                <span className="card-filmName">Viotlet Evegarden | The Movie</span>
                <span className="card-play-btn"><IoIosPlayCircle /></span>
              </a>
              <a href="#" className="card-film">
                <img src="/violet-movie.jpg" alt="" className="card-poster" />
                <span className="card-play-btn"><IoIosPlayCircle /></span>
              </a>
              <a href="#" className="card-film">
                <img src="/violet-movie.jpg" alt="" className="card-poster" />
                <span className="card-play-btn"><IoIosPlayCircle /></span>
              </a>
            </div>
          </section>
        </div>
      </header>
  );
};
export default ClientHeader;
