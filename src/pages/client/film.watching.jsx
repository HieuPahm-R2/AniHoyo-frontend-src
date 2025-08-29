import React, { useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import {
    Breadcrumb, Button, Card, Col, Divider, Dropdown, Flex,
    Image, List, Menu, Row, Select, Space, Tabs, Tag, Typography, ConfigProvider,
    message,
} from 'antd'
import {
    PlayCircleOutlined, ShareAltOutlined, HeartOutlined,
    SaveOutlined, ThunderboltOutlined, ClockCircleOutlined, HomeOutlined, AppstoreOutlined,
} from '@ant-design/icons'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';


const { Title, Text, Paragraph } = Typography

const mockEpisodes = Array.from({ length: 12 }, (_, i) => ({
    index: i + 1,
    name: `Tập ${i + 1}`,
}))

const mockRelated = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Gợi ý #${i + 1}`,
    poster: `/public/violet-movie.jpg`,
}))

const seriesInfo = {
    title: 'Dandadan 2nd Season',
    altTitle: 'Dandadan Season 2',
    year: 2025,
    status: 'Đang phát sóng',
    genres: ['Hành động', 'Hài hước', 'Siêu nhiên'],
    studios: ['Science SARU'],
    poster: '/public/summer2025.jpg',
    description:
        'Dandadan theo chân những cuộc phiêu lưu siêu nhiên, pha trộn hành động, hài hước và cảm xúc. Phần 2 tiếp nối với nhịp độ nhanh, mở rộng thế giới và nhân vật.',
}

const sourcesByServer = {
    VIP: {
        label: 'VIP',
        qualities: {
            '1080p': '/storage/videos_hls/Tap1/master.m3u8',
            '720p': '/storage/videos_hls/tap2/master.m3u8',
            '360p': '/storage/videos_hls/Tap1/master.m3u8',
        },
    },
    CDN: {
        label: 'CDN',
        qualities: {
            '1080p': '/storage/videos_hls/Tap1/master.m3u8',
            '720p': '/storage/videos_hls/tap2/master.m3u8',
            '360p': '/storage/videos_hls/Tap1/master.m3u8',
        },
    },
}

const FilmWatching = () => {
    const videoRef = useRef(null)
    const hlsRef = useRef(null)
    const [currentEpisode, setCurrentEpisode] = useState(1)
    const [currentServer, setCurrentServer] = useState('VIP')
    const [currentQuality, setCurrentQuality] = useState('1080p')

    const currentSource = useMemo(() => {
        const server = sourcesByServer[currentServer]
        if (!server) return ''
        return server.qualities[currentQuality] || ''
    }, [currentServer, currentQuality])

    useEffect(() => {
        document.body.classList.add("client-theme");
        return () => {
            document.body.classList.remove("client-theme");
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current || !currentSource) return
        const video = videoRef.current

        if (Hls.isSupported()) {
            if (hlsRef.current) {
                hlsRef.current.destroy()
            }
            const hls = new Hls({ enableWorker: true })
            hlsRef.current = hls
            hls.loadSource(currentSource)
            hls.attachMedia(video)
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => { })
            })
            return () => {
                hls.destroy()
                hlsRef.current = null
            }
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = currentSource
            video.play().catch(() => { })
        }
    }, [currentSource, currentEpisode])

    const qualityMenu = (
        <Menu
            items={Object.keys(sourcesByServer[currentServer].qualities).map((q) => ({
                key: q,
                label: q,
                onClick: () => setCurrentQuality(q),
            }))}
        />
    )

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
                        { title: seriesInfo.title },
                        { title: `Tập ${currentEpisode}` },
                    ]}
                />

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <Card bordered={false} bodyStyle={{ padding: 0 }}>
                            <div style={{ position: 'relative', background: '#000' }}>
                                <MediaPlayer
                                    src={`http://localhost:8083/api/v1/10/master.m3u8`}
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
                                        <Title level={4} style={{ margin: 0 }}>{seriesInfo.title}</Title>
                                        <Text type="success">{`Tập ${currentEpisode}`} • <ThunderboltOutlined /> {seriesInfo.status}</Text>
                                    </Space>
                                    <Space wrap>
                                        <Button icon={<HeartOutlined />}>Yêu thích</Button>
                                        <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
                                        <Button icon={<SaveOutlined />}>Lưu</Button>
                                    </Space>
                                </Flex>

                                <Divider style={{ margin: '12px 0' }} />

                                <Flex align="center" gap={12} wrap>

                                    <Tabs
                                        activeKey={currentServer}
                                        onChange={setCurrentServer}
                                        items={Object.keys(sourcesByServer).map((k) => ({ key: k, label: k }))}
                                    />
                                    <Dropdown overlay={qualityMenu} trigger={['click']}>
                                        <Button>{currentQuality}</Button>
                                    </Dropdown>
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
                                <Paragraph style={{ marginBottom: 8 }}>{seriesInfo.description}</Paragraph>
                                <Space wrap>
                                    <Tag color="blue">{seriesInfo.year}</Tag>
                                    <Tag color="green">{seriesInfo.status}</Tag>
                                    {seriesInfo.genres.map((g) => (<Tag key={g}>{g}</Tag>))}
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
                                    src={seriesInfo.poster}
                                    preview={false}
                                />
                                <Space direction="vertical" size={4} style={{ flex: 1 }}>
                                    <Title level={5} style={{ margin: 0 }}>{seriesInfo.title}</Title>
                                    <Space wrap>
                                        {seriesInfo.genres.map((g) => (<Tag color="geekblue" key={g}>{g}</Tag>))}

                                    </Space>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorBgContainer: '#ffffff',
                                                colorText: '#141414',
                                                colorBorder: '#d9d9d9',
                                            },
                                            components: {
                                                Select: {
                                                    colorBgContainer: '#ffffff',
                                                    colorText: '#141414',
                                                },
                                            },
                                        }}
                                    >
                                        <Select
                                            size={36}
                                            defaultValue="SEASON/OVA/ MOVIE"
                                            style={{ width: 200, marginTop: "10px" }}
                                            dropdownStyle={{ background: '#ffffff' }}
                                        />
                                    </ConfigProvider>
                                </Space>
                            </Flex>
                            <Divider />
                            <Flex justify="space-between" wrap>
                                <Space direction="vertical" size={0}>
                                    <Text type="danger">Năm</Text>
                                    <Text success>{seriesInfo.year}</Text>
                                </Space>
                                <Space direction="vertical" size={0}>
                                    <Text type="success">Tình trạng</Text>
                                    <Text>{seriesInfo.status}</Text>
                                </Space>
                                <Space direction="vertical" size={0}>
                                    <Text type="warning">Studio</Text>
                                    <Text>{seriesInfo.studios.join(', ')}</Text>
                                </Space>
                            </Flex>
                        </Card>

                        <Card bordered={false} style={{ marginTop: 16 }} title="Danh sách tập">
                            <Space wrap>
                                {mockEpisodes.map((e) => (
                                    <Button
                                        key={e.index}
                                        type={e.index === currentEpisode ? 'primary' : 'default'}
                                        onClick={() => setCurrentEpisode(e.index)}
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