import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Breadcrumb, Button, Card, Col, Divider, Dropdown, Flex,
    Image, List, Menu, Row, Space, Tag, Typography, ConfigProvider, message,
} from 'antd'
import {
    PlayCircleOutlined, ShareAltOutlined, HeartOutlined,
    SaveOutlined, ThunderboltOutlined, ClockCircleOutlined, HomeOutlined, AppstoreOutlined,
} from '@ant-design/icons'
import { MediaPlayer, MediaPlayerInstance, MediaProvider } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchAllEpisodeBySeason, fetchFilmByIdAPI, fetchSeasonById, checkView } from '@/config/api.handle';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { convertSlug } from '@/config/utils';
import { v4 as uuidv4 } from 'uuid';
import instance from '@/config/axios.customize';

const { Title, Text, Paragraph } = Typography


const FilmWatching = () => {
    const [currentEpisode, setCurrentEpisode] = useState(1)
    const [videoId, setVideoId] = useState("");
    const [episodeList, setEpisodeList] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [listRelated, setListRelated] = useState([])
    const [hasSentView, setHasSentView] = useState(false);
    const videoRef = useRef(null);

    const navigate = useNavigate();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id");

    useEffect(() => {
        document.body.classList.add("client-theme");
        return () => {
            document.body.classList.remove("client-theme");
        };
    }, []);
    useEffect(() => {

        const player = videoRef.current;
        if (!player) return;

        const handleTimeUpdate = () => {
            const duration = player.duration ?? 0;
            const currentTime = player.currentTime ?? 0;

            if (duration > 0) {
                const percentageWatched = currentTime / duration;
                if (!hasSentView && percentageWatched >= 0.1) {
                    const sessionId = getSessionId();
                    console.log("Sending view with sessionId:", sessionId, "videoId:", videoId);
                    checkView(videoId, sessionId)
                        .then(() => setHasSentView(true))
                        .catch(err => console.error("Error updating view", err));
                }
            }
        };

        player.addEventListener("time-update", handleTimeUpdate);

        return () => {
            player.removeEventListener("time-update", handleTimeUpdate);
        }
    }
        , [videoId, hasSentView]);
    useEffect(() => {
        const fetchFilmById = async () => {
            const res = await fetchSeasonById(id);
            console.log('fetchSeasonById response:', res);
            if (res && res.data) {
                let rawData = res.data;
                setSelectedSeason({ ...rawData }); // Tạo object mới để đảm bảo re-render
                console.log('setSelectedSeason called with:', rawData);
            } else {
                console.log('No data returned from fetchSeasonById');
            }
        }
        fetchFilmById();
    }, [id]);
    useEffect(() => {
        if (selectedSeason) {
            fetchEpisodes();
            fetchRelated();
        } else {
            console.log('useEffect selectedSeason is null or falsy');
        }
    }, [selectedSeason]);

    const getSessionId = () => {
        let id = localStorage.getItem('movieSessionId');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('movieSessionId', id);
        }
        return id;
    };
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    const mockEpisodes = Array.from({ length: episodeList.length }, (_, i) => ({
        index: i,
        name: `Tập ${i + 1}`,
    }))

    const mockRelated = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Gợi ý #${i + 1}`,
        poster: `/public/violet-movie.jpg`,
    }))
    const handleRedirect = (item) => {
        const slug = convertSlug(item.seasonName);
        navigate(`/detail/${slug}?id=${item.id}`)
    }

    const fetchEpisodes = async () => {
        if (selectedSeason?.id) {
            try {
                const res = await fetchAllEpisodeBySeason(selectedSeason?.id)
                console.log('API response:', res);
                if (res && res.data) {
                    console.log('API response data:', res.data);
                    const accept = res.data.result.map((item) => ({
                        videoId: item.id,
                        title: item.title,
                    }))
                    setEpisodeList(accept)
                    if (accept.length > 0) {
                        const targetEpisodeIndex = 0;
                        setCurrentEpisode(targetEpisodeIndex);
                        setVideoId(accept[targetEpisodeIndex].videoId);
                        console.log(`Set initial episode: ${targetEpisodeIndex}, videoId: ${accept[targetEpisodeIndex].videoId}`);
                    }
                }
            } catch (error) {
                console.error('Error fetching episodes:', error);
            }
        } else {
            console.log('No selectedSeason or selectedSeason.id is missing');
        }
    }
    const fetchRelated = async () => {
        if (selectedSeason?.id) {
            try {
                const res = await fetchFilmByIdAPI(selectedSeason?.id)
                if (res && res.data) {
                    console.log('API response data:', res.data);
                    const accept = res.data.seasons.map((item) => ({
                        title: item.ordinal,
                        id: item.id,
                        seasonName: item.seasonName
                    }))
                    setListRelated(accept)
                }
            } catch (error) {
                console.error('Error fetching episodes:', error);
            }
        } else {
            console.log('No selectedSeason or selectedSeason.id is missing');
        }
    }

    // Handle episode change
    const handleEpisodeChange = (episodeIndex) => {
        const episode = episodeList[episodeIndex];
        if (episode) {
            setCurrentEpisode(episodeIndex);
            setVideoId(episode.videoId);
            message.success(`Đang chuyển sang ${episode.title}`);
        }
    };


    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: '#141414',
                    colorBgElevated: 'cyan',
                    colorBorder: '#262626',
                    colorText: '#e8e8e8',
                    colorTextSecondary: '#bfbfbf',
                    borderRadius: 8,
                },
            }}
        >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Breadcrumb
                    items={[
                        { href: '/', title: <HomeOutlined /> },
                        { href: '/phim', title: <><AppstoreOutlined /> <span style={{ marginLeft: 6 }}>Phim</span></> },
                        { title: `${selectedSeason?.seasonName}` },
                        { title: `Tập ${currentEpisode}` },
                    ]}
                />

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <Card bordered={false} bodyStyle={{ padding: 0 }}>
                            <div style={{ position: 'relative', background: '#000' }}>
                                <MediaPlayer
                                    ref={videoRef}
                                    src={`http://localhost:8083/api/v1/${videoId}/master.m3u8`}
                                    viewType='video'
                                    streamType='on-demand'
                                    onError={(e) => {
                                        message.error('Lỗi phát video');
                                    }}
                                    style={{ width: '100%', height: 'auto' }}
                                >
                                    <MediaProvider />
                                    <DefaultVideoLayout
                                        icons={defaultLayoutIcons}
                                    />
                                </MediaPlayer>
                            </div>
                            <div style={{ padding: 16 }}>
                                <Flex align="center" justify="space-between" wrap>
                                    <Space direction="vertical" size={4}>
                                        <Title level={4} style={{ margin: 0 }}>{selectedSeason?.seasonName}</Title>
                                        <Text type="success">{`Tập ${currentEpisode}`} • <ThunderboltOutlined /> {selectedSeason?.status}</Text>
                                    </Space>
                                    <Space wrap>
                                        <Button icon={<HeartOutlined />}>Yêu thích</Button>
                                        <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
                                        <Button icon={<SaveOutlined />}>Lưu</Button>
                                    </Space>
                                </Flex>

                                <Divider style={{ margin: '12px 0' }} />

                                <Flex align="center" gap={12} wrap>

                                    <Space>
                                        <Button type="primary" icon={<PlayCircleOutlined />}>Tiếp tục xem</Button>
                                        <Button icon={<ClockCircleOutlined />}>Xem sau</Button>
                                    </Space>
                                </Flex>
                            </div>
                        </Card>

                        <Card bordered={false} style={{ marginTop: 16 }}>
                            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                <Title level={5} style={{ margin: 0 }}>Giới thiệu</Title>
                                <Paragraph style={{ marginBottom: 8 }}>{selectedSeason?.description}</Paragraph>
                                <Space wrap>
                                    <Tag color="blue">{selectedSeason?.releaseYear}</Tag>
                                    <Tag color="green">{selectedSeason?.status}</Tag>
                                    {(selectedSeason?.film?.categories || []).map((g) => (<Tag >{g.name}</Tag>))}
                                </Space>
                            </Space>
                        </Card>

                        <Card bordered={false} style={{ marginTop: 16 }} title="Bình luận">
                            <List
                                itemLayout="vertical"
                                dataSource={[1, 2, 3].map((i) => ({
                                    id: i,
                                    user: `Người dùng ${i}`,
                                    content: 'Hay quá! Tập này căng thẳng mà vui nữa.',
                                }))}
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={<Text strong>{item.user}</Text>}
                                            description={<Text type="warning">vừa xong</Text>}
                                        />
                                        <Text>{item.content}</Text>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card bordered={false}>
                            <Flex gap={16} align="flex-start">
                                <Image
                                    width={96}
                                    height={128}
                                    style={{ objectFit: 'cover', borderRadius: 8 }}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/visual/${selectedSeason?.thumb}`}
                                    preview={false}
                                />
                                <Space direction="vertical" size={4} style={{ flex: 1 }}>
                                    <Title level={5} style={{ margin: 0 }}>{selectedSeason?.seasonName}</Title>
                                    <Space wrap>
                                        {(selectedSeason?.film?.categories || []).map((g) => (<Tag color="geekblue">{g.name}</Tag>))}

                                    </Space>
                                    <p>XEM THÊM  SEASON/ OVA/ MOVIE</p>

                                    <Carousel
                                        removeArrowOnDeviceType={["tablet", "mobile"]} responsive={responsive}>

                                        {listRelated.map((g) =>
                                        (<div onClick={() => handleRedirect(g)} style={{
                                            display: "flex", justifyContent: "center", cursor: "pointer", borderRadius: "3px",
                                            width: "50px", height: "20px", background: "#8FBC8F", padding: "5px"
                                        }
                                        }>{g.title}</div>))}

                                    </Carousel>

                                </Space>
                            </Flex>
                            <Divider />
                            <Flex justify="space-between" wrap>
                                <Space direction="vertical" size={0}>
                                    <Text type="danger">Năm</Text>
                                    <Text success>{selectedSeason?.releaseYear}</Text>
                                </Space>
                                <Space direction="vertical" size={0}>
                                    <Text type="success">Tình trạng</Text>
                                    <Text>{selectedSeason?.status}</Text>
                                </Space>
                                <Space direction="vertical" size={0}>
                                    <Text type="warning">Views </Text>
                                    <Text>{selectedSeason?.viewCount.toLocaleString()}</Text>
                                </Space>
                            </Flex>
                        </Card>

                        <Card bordered={false} style={{ marginTop: 16 }} title="Danh sách tập">
                            <Space wrap>
                                {mockEpisodes.map((e) => (
                                    <Button
                                        key={e.index}
                                        type={e.index === currentEpisode ? 'primary' : 'default'}
                                        onClick={() => handleEpisodeChange(e.index)}
                                    >
                                        {e.name}
                                    </Button>
                                ))}
                            </Space>
                        </Card>


                        <Card bordered={false} style={{ marginTop: 16 }} title="Có thể bạn cũng thích">
                            <List
                                itemLayout="horizontal"
                                dataSource={mockRelated}
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            avatar={<Image src={item.poster} width={56} height={80} style={{ objectFit: 'cover' }} preview={false} />}
                                            title={<a href="#">{item.title}</a>}
                                            description={<Text type="warning">TV • 12 tập</Text>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </Space>
        </ConfigProvider>
    )
}

export default FilmWatching