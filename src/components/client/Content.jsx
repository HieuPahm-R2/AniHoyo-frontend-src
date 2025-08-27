import React, { useState, useEffect } from 'react'
import { Col, Divider, Pagination, Rate, Row, Select, Tabs } from "antd";
import { FilterTwoTone, ReloadOutlined, StarFilled, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { IoIosPlayCircle } from "react-icons/io";
import './Content.css';
import { fetchFilmCategory, fetchFilmTags } from '@/config/api.handle';


const Content = (props) => {
    const { handleRedirect } = props
    const [listCategory, setListCategory] = useState([]);
    const [listTags, setListTags] = useState([]);
    const [listFilm, setListFilm] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("sort=uploadDate,desc");
    const [filter, setFilter] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetchFilmCategory();
            if (res && res.data) {
                const accept = res.data.result.map((item) => ({
                    label: item.name,
                    value: item.id
                }))
                setListCategory(accept);
            }
        }
        const fetchTags = async () => {
            const res = await fetchFilmTags();
            if (res && res.data) {
                const accept = res.data.result.map((item) => ({
                    label: item.tagName,
                    value: item.id
                }))
                setListTags(accept)
            }
        }
        fetchCategories();
        fetchTags();
    }, [])
    useEffect(() => {
        const fetchFilms = async () => {
            setIsLoading(true);
            let queryString = `current=${current}&pageSize=${pageSize}`;
            if (filter) {
                queryString += `&${filter}`;
            }
            if (sortQuery) {
                queryString += `&${sortQuery}`;
            }
            const res = await FetchAndFilterBook(queryString);
            if (res && res.data) {
                setListBook(res.data.result);
                setTotal(res.data.meta.total);
            }
            setIsLoading(false);
        }
        fetchFilms();
    }, [current, pageSize, sortQuery, filter]);
    // Dữ liệu mẫu cho bảng xếp hạng
    const rankingMovies = [
        {
            id: 1,
            rank: 1,
            title: "Thanh Gươm Diệt Quỷ: Vô Hạn Thành",
            originalTitle: "Demon Slayer: Kimetsu no Yaiba - Infinity Castle Arc",
            rating: 8.2,
            duration: "01/03",
            year: 2025,
            quality: "CAM",
            thumbnail: "/demon1.webp",
            genre: "Action, Fantasy"
        },
        {
            id: 2,
            rank: 2,
            title: "Kidou Senshi Gundam SEED Freedom",
            originalTitle: "Mobile Suit Gundam SEED Freedom",
            rating: 9.4,
            duration: "124 phút",
            year: 2024,
            quality: "HD",
            thumbnail: "/sug-1.webp",
            genre: "Mecha, Sci-Fi"
        },
        {
            id: 3,
            rank: 3,
            title: "Thanh Gươm Diệt Quỷ: Chuyến Tàu Vô Tận",
            originalTitle: "Demon Slayer: Kimetsu no Yaiba - Mugen Train",
            rating: 7.7,
            duration: "1 giờ 57 phút",
            year: 2020,
            quality: "BD",
            thumbnail: "/demon1.webp",
            genre: "Action, Fantasy"
        },

    ];
    const items = [
        {
            key: "sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: `Mới nhất`,
            children: <></>,
        },
        {
            key: 'sort=view',
            label: `Movie`,
            children: <></>,
        },
    ];
    const handleOnchangePage = (pagination) => {
        if (pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }
    return (
        <div className="catalog">
            <div className="container" style={{ marginLeft: "10px" }}>
                <div className="catalog__nav">
                    <div className="catalog__select-wrap">
                        <Select
                            showSearch
                            placeholder="Thể Loại / Tag"
                            optionFilterProp="Season Film"
                            options={[
                                {
                                    value: 'Ecchi',
                                    label: 'Ecchi',
                                },
                                {
                                    value: 'Winter 2022',
                                    label: 'Commedy',
                                },
                                {
                                    value: 'Spring 2021',
                                    label: 'Romance',
                                },
                            ]}
                        />

                        <Select
                            showSearch
                            placeholder="Season phim"
                            optionFilterProp="Season Film"
                            options={[
                                {
                                    value: 'Summer 2023',
                                    label: 'Summer 2023',
                                },
                                {
                                    value: 'Winter 2022',
                                    label: 'Winter 2022',
                                },
                                {
                                    value: 'Spring 2021',
                                    label: 'Tom',
                                },
                            ]}
                        />
                    </div>

                    <div className="slider-radio">
                        <Tabs
                            defaultActiveKey="sort=-sold"
                            items={items}
                            style={{ overflowX: "auto" }}
                        />
                    </div>
                </div>

                <Row gutter={[20, 10]} >
                    <Col md={5} sm={0} xs={0}>
                        <div className="ranking-container">
                            <div className="ranking-header">
                                <span className="ranking-title">
                                    <FilterTwoTone className="ranking-icon" />
                                    <span className="ranking-text">
                                        Top Ranking of Weeks
                                    </span>
                                </span>
                            </div>

                            {/* Bảng xếp hạng phim */}
                            <div className="ranking-list">
                                {rankingMovies.map((movie, index) => (
                                    <div
                                        key={movie.id}
                                        className="ranking-item"
                                        onClick={() => handleRedirect(movie)}
                                    >
                                        {/* Thứ hạng */}
                                        <div className="rank-badge">
                                            <div className="rank-number">
                                                #{index + 1}
                                            </div>
                                        </div>

                                        {/* Thumbnail */}
                                        <div className="movie-thumbnail">
                                            <img
                                                src={movie.thumbnail}
                                                alt={movie.title}
                                                className="thumbnail-image"
                                            />
                                            {/* Chất lượng video */}
                                            <div className={`quality-badge quality-${movie.quality.toLowerCase()}`}>
                                                {movie.quality}
                                            </div>
                                        </div>

                                        {/* Thông tin phim */}
                                        <div className="movie-info">
                                            <h4 className="movie-title" title={movie.title}>
                                                {movie.title}
                                            </h4>

                                            {/* Rating */}
                                            <div className="movie-rating">
                                                <StarFilled className="rating-star" />
                                                <span className="rating-score">
                                                    {movie.rating}
                                                </span>
                                            </div>

                                            {/* Thông tin chi tiết */}
                                            <div className="movie-details">
                                                <div className="detail-item">
                                                    <ClockCircleOutlined className="detail-icon" />
                                                    <span className="detail-text">
                                                        {movie.duration}
                                                    </span>
                                                </div>
                                                <div className="detail-item">
                                                    <CalendarOutlined className="detail-icon" />
                                                    <span className="detail-text">
                                                        {movie.year}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                    <Col md={19} xs={24}>
                        <div
                            style={{
                                padding: "20px",
                                borderRadius: 5,
                            }}
                        >
                            <Row className="customize-row">
                                <div className="card--big">
                                    <div className="card">
                                        <a href="details.html" className="card__cover">
                                            <img src="/sug-1.webp" alt="" />
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z" strokeLinecap="round" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </a>
                                        <button className="card__add" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" /></svg></button>
                                        <span className="card__rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" /></svg> 7.1</span>
                                        <h3 className="card__title"><a href="details.html">Interview With the Vampir</a></h3>
                                        <ul className="card__list">
                                            <li>Free</li>
                                            <li>Horror</li>
                                            <li>1994</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card--big">
                                    <div className="card">
                                        <a href="details.html" className="card__cover">
                                            <img src="/sug-1.webp" alt="" />
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z" strokeLinecap="round" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </a>
                                        <button className="card__add" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" /></svg></button>
                                        <span className="card__rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" /></svg> 7.1</span>
                                        <h3 className="card__title"><a href="details.html">Hieu Pahn Here</a></h3>
                                        <ul className="card__list">
                                            <li>Free</li>
                                            <li>Horror</li>
                                            <li>1994</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card--big">
                                    <div className="card">
                                        <a href="details.html" className="card__cover">
                                            <img src="/sug-1.webp" alt="" />
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z" strokeLinecap="round" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </a>
                                        <button className="card__add" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z" /></svg></button>
                                        <span className="card__rating"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" /></svg> 7.1</span>
                                        <h3 className="card__title"><a href="details.html">Interview With the Vampir</a></h3>
                                        <ul className="card__list">
                                            <li>Free</li>
                                            <li>Horror</li>
                                            <li>1994</li>
                                        </ul>
                                    </div>
                                </div>


                            </Row>
                            <div style={{ marginTop: 30 }}></div>
                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>


        </div>
    )
}

export default Content