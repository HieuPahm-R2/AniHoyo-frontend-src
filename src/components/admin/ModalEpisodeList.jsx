import { Drawer, message, List, Avatar, Button, Space, Slider, Dropdown } from 'antd'
import Hls from "hls.js";
import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    SoundOutlined,
    FullscreenOutlined,
    SettingOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { fetchAllEpisodeBySeason } from '../../services/api-handle';

const ModalEpisodeList = (props) => {
    const { modalListEpisode, setModalListEpisode, dataSeason, selectedSeason, onSeasonSelect } = props

    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const controlsRef = useRef(null);

    const [videoId, setVideoId] = useState("");
    const [currentEpisode, setCurrentEpisode] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [episodeList, setEpisodeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    // Safe cleanup function
    const safeCleanup = useCallback(() => {
        try {
            if (hlsRef.current) {
                console.log('Safely destroying HLS player');
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        } catch (error) {
            console.error('Error cleanup:', error);
        }
    }, []);

    // Save modal state to localStorage
    const saveModalState = (isOpen, seasonId, episodeIndex) => {
        if (isOpen) {
            localStorage.setItem('modalEpisodeList', JSON.stringify({
                isOpen: true,
                seasonId: seasonId?.id,
                episodeIndex: episodeIndex,
                timestamp: Date.now()
            }));
        } else {
            localStorage.removeItem('modalEpisodeList');
        }
    };

    // Restore modal state from localStorage
    const restoreModalState = () => {
        const savedState = localStorage.getItem('modalEpisodeList');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                // Check if saved state is not too old (within 1 hour)
                const isRecent = Date.now() - state.timestamp < 3600000;

                if (state.isOpen && state.seasonId && isRecent) {
                    // Find the season and restore state
                    if (dataSeason && dataSeason.length > 0) {
                        const season = dataSeason.find(s => s.id === state.seasonId);
                        if (season) {
                            console.log('Restoring modal state for season:', season.id);
                            setModalListEpisode(true);
                            // Force update selectedSeason if different
                            if (season.id !== selectedSeason?.id) {
                                onSeasonSelect?.(season);
                            }
                            // Set episode index
                            if (state.episodeIndex !== undefined) {
                                setCurrentEpisode(state.episodeIndex);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error restoring modal state:', error);
                localStorage.removeItem('modalEpisodeList');
            }
        }
    };

    // Restore modal state on mount and when dataSeason changes
    useEffect(() => {
        if (dataSeason && dataSeason.length > 0) {
            restoreModalState();
        }
    }, [dataSeason]);

    // Save modal state when it changes
    useEffect(() => {
        if (modalListEpisode) {
            saveModalState(modalListEpisode, selectedSeason, currentEpisode);
        }
    }, [modalListEpisode, selectedSeason, currentEpisode]);

    // Reset video state when modal opens
    useEffect(() => {
        if (modalListEpisode && videoRef.current) {
            // Reset video to beginning
            videoRef.current.currentTime = 0;
            videoRef.current.load();
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, [modalListEpisode]);

    // Fetch episodes when selectedSeason changes
    useEffect(() => {
        if (selectedSeason) {
            fetchEpisodes();
        }
    }, [selectedSeason]);

    // Cleanup when modal closes
    useEffect(() => {
        if (!modalListEpisode) {
            safeCleanup();
        }
    }, [modalListEpisode, safeCleanup]);

    // Auto-hide controls
    useEffect(() => {
        let timeout;
        if (isPlaying && showControls) {
            timeout = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, showControls]);

    // Initialize video player when videoId changes
    useEffect(() => {
        if (!videoRef.current || !videoId || !modalListEpisode) return;

        console.log(`Initializing video player for videoId: ${videoId}`);
        setIsLoading(true);

        // Clean up previous players first
        safeCleanup();

        // Small delay to ensure DOM is ready
        const initTimer = setTimeout(() => {
            if (!videoRef.current || !videoId) {
                return;
            }

            let hls;

            // Clear video element completely
            if (videoRef.current) {
                videoRef.current.src = '';
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }

            // Initialize HLS
            if (Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: false, // Disable worker to avoid DOM issues
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    maxBufferLength: 30,
                    maxMaxBufferLength: 600,
                    maxBufferSize: 60 * 1000 * 1000,
                    maxBufferHole: 0.5,
                    highBufferWatchdogPeriod: 2,
                    nudgeOffset: 0.2,
                    nudgeMaxRetry: 5,
                    maxFragLookUpTolerance: 0.25,
                    liveSyncDurationCount: 3,
                    liveMaxLatencyDurationCount: 10,
                    liveDurationInfinity: true,
                    liveBackBufferLength: 90,
                    liveTolerance: 15,
                    progressive: false,
                    debug: false,
                });

                hlsRef.current = hls;

                console.log(`Loading HLS source for video ID: ${videoId}`);
                hls.loadSource(`http://localhost:8083/api/v1/${videoId}/master.m3u8`);
                hls.attachMedia(videoRef.current);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log("HLS manifest parsed successfully");
                    setIsLoading(false);
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error("HLS Error:", data);
                    setIsLoading(false);
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log("Network error, trying to recover...");
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log("Media error, trying to recover...");
                                hls.recoverMediaError();
                                break;
                            default:
                                console.log("Fatal error, destroying...");
                                hls.destroy();
                                break;
                        }
                    }
                });

            } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
                // Safari native HLS support
                console.log(`Loading Safari HLS source for video ID: ${videoId}`);
                videoRef.current.src = `http://localhost:8083/api/v1/${videoId}/master.m3u8`;
                setIsLoading(false);
            } else {
                message.error("Trình duyệt không hỗ trợ phát video HLS");
                setIsLoading(false);
                return;
            }
        }, 100);

        return () => {
            clearTimeout(initTimer);
            safeCleanup();
        };
    }, [videoId, modalListEpisode, safeCleanup]);

    const fetchEpisodes = async () => {
        if (selectedSeason?.id) {
            try {
                const res = await fetchAllEpisodeBySeason(selectedSeason.id)
                if (res && res.data) {
                    const accept = res.data.result.map((item) => ({
                        videoId: item.id,
                        title: item.title,
                    }))
                    setEpisodeList(accept)
                    console.log('Episode list set:', accept)
                    if (accept.length > 0) {
                        // Restore episode index from localStorage if available
                        const savedState = localStorage.getItem('modalEpisodeList');
                        let targetEpisodeIndex = 0;

                        if (savedState) {
                            try {
                                const state = JSON.parse(savedState);
                                if (state.episodeIndex !== undefined && state.episodeIndex < accept.length) {
                                    targetEpisodeIndex = state.episodeIndex;
                                }
                            } catch (error) {
                                console.error('Error parsing saved state:', error);
                            }
                        }

                        setCurrentEpisode(targetEpisodeIndex);
                        setVideoId(accept[targetEpisodeIndex].videoId);
                        console.log(`Set initial episode: ${targetEpisodeIndex}, videoId: ${accept[targetEpisodeIndex].videoId}`);
                    }
                }
            } catch (error) {
                console.error('Error fetching episodes:', error);
                message.error('Lỗi khi tải danh sách tập phim');
            }
        } else {
            console.log('No selectedSeason or selectedSeason.id is missing');
        }
    }

    // Handle episode change
    const handleEpisodeChange = (episodeIndex) => {
        const episode = episodeList[episodeIndex];
        if (episode) {
            console.log(`Changing to episode: ${episode.title} (ID: ${episode.videoId})`);

            // Pause current video if playing
            if (videoRef.current && isPlaying) {
                try {
                    videoRef.current.pause();
                } catch (error) {
                    console.error('Error pausing video:', error);
                }
                setIsPlaying(false);
            }

            // Clean up current players
            safeCleanup();

            // Reset video element
            if (videoRef.current) {
                console.log('Resetting video element');
                try {
                    videoRef.current.currentTime = 0;
                    videoRef.current.load();
                    // Clear any existing source
                    videoRef.current.src = '';
                    videoRef.current.removeAttribute('src');
                } catch (error) {
                    console.error('Error resetting video element:', error);
                }
            }

            setCurrentEpisode(episodeIndex);
            setVideoId(episode.videoId);
            setCurrentTime(0);
            setDuration(0);
            message.success(`Đang chuyển sang ${episode.title}`);
        }
    };

    // Handle play/pause
    const togglePlay = () => {
        if (videoRef.current) {
            try {
                if (isPlaying) {
                    videoRef.current.pause();
                } else {
                    videoRef.current.play();
                }
            } catch (error) {
                console.error('Error toggling play/pause:', error);
            }
        }
    };

    // Handle time update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
        }
    };

    // Handle play/pause events
    const handlePlay = () => {
        setIsPlaying(true);
        setShowControls(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
        setShowControls(true);
    };

    // Handle video end
    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        // Auto play next episode
        if (currentEpisode < episodeList.length - 1) {
            handleEpisodeChange(currentEpisode + 1);
        }
    };

    // Format time
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle seek
    const handleSeek = (value) => {
        if (videoRef.current && duration > 0) {
            const seekTime = (value / 100) * duration;
            videoRef.current.currentTime = seekTime;
        }
    };

    // Handle volume change
    const handleVolumeChange = (value) => {
        if (videoRef.current) {
            const newVolume = value / 100;
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.volume = volume;
                setIsMuted(false);
            } else {
                videoRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    // Handle playback rate change
    const handlePlaybackRateChange = (rate) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    // Show controls on mouse move
    const handleMouseMove = () => {
        setShowControls(true);
    };

    const onCloseChild = () => {
        // Cleanup
        safeCleanup();
        // Clear localStorage when closing
        localStorage.removeItem('modalEpisodeList');
        setModalListEpisode(false);
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            safeCleanup();
        };
    }, [safeCleanup]);

    // Playback rate options
    const playbackRateOptions = [
        { label: '0.5x', value: 0.5 },
        { label: '0.75x', value: 0.75 },
        { label: '1x', value: 1 },
        { label: '1.25x', value: 1.25 },
        { label: '1.5x', value: 1.5 },
        { label: '2x', value: 2 },
    ];

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Danh sách tập phim:</span>
                </div>
            }
            width={"80vw"}
            placement={'left'}
            closable={true}
            onClose={onCloseChild}
            open={modalListEpisode}
            bodyStyle={{ padding: '16px' }}
            destroyOnClose={true}
        >
            <div style={{ display: 'flex', gap: '20px', height: '100%', alignItems: 'flex-start' }}>
                {/* Video Player Section */}
                <div style={{ flex: '2', minHeight: '400px' }}>
                    <div
                        style={{
                            width: "100%",
                            height: "400px",
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#000',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => {
                            if (isPlaying) {
                                setTimeout(() => setShowControls(false), 1000);
                            }
                        }}
                    >
                        {isLoading && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#fff',
                                fontSize: '16px',
                                zIndex: 10
                            }}>
                                Đang tải video...
                            </div>
                        )}

                        <video
                            id="player"
                            ref={videoRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',

                            }}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleEnded}
                            onError={(e) => {
                                console.error('Video error:', e);
                                message.error('Lỗi phát video');
                            }}
                        />

                        {/* Custom Video Controls - Plyr Style */}
                        <div
                            ref={controlsRef}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                                padding: '20px 15px 15px',
                                borderRadius: '0 0 8px 8px',
                                opacity: showControls ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                zIndex: 20
                            }}
                        >
                            {/* Progress Bar */}
                            <div style={{ marginBottom: '15px' }}>
                                <Slider
                                    value={duration > 0 ? (currentTime / duration) * 100 : 0}
                                    onChange={handleSeek}
                                    tooltip={{
                                        formatter: (value) => {
                                            const time = (value / 100) * duration;
                                            return formatTime(time);
                                        }
                                    }}
                                    style={{
                                        margin: 0
                                    }}
                                />
                            </div>

                            {/* Controls Row */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '15px'
                            }}>
                                {/* Left Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {/* Play/Pause Button */}
                                    <Button
                                        type="text"
                                        icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                        onClick={togglePlay}
                                        style={{
                                            color: '#fff',
                                            fontSize: '24px',
                                            padding: '4px 8px'
                                        }}
                                    />

                                    {/* Volume Control */}
                                    <div style={{ position: 'relative' }}>
                                        <Button
                                            type="text"
                                            icon={<SoundOutlined />}
                                            onClick={toggleMute}
                                            style={{
                                                color: '#fff',
                                                fontSize: '18px',
                                                padding: '4px 8px'
                                            }}
                                        />
                                        {showVolumeSlider && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '100%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: 'rgba(0,0,0,0.9)',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                marginBottom: '10px'
                                            }}>
                                                <Slider
                                                    vertical
                                                    value={isMuted ? 0 : volume * 100}
                                                    onChange={handleVolumeChange}
                                                    style={{ height: '100px' }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Time Display */}
                                    <span style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                {/* Right Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {/* Playback Rate */}
                                    <Dropdown
                                        menu={{
                                            items: playbackRateOptions.map(option => ({
                                                key: option.value,
                                                label: option.label,
                                                onClick: () => handlePlaybackRateChange(option.value)
                                            }))
                                        }}
                                        placement="topCenter"
                                    >
                                        <Button
                                            type="text"
                                            style={{
                                                color: '#fff',
                                                fontSize: '14px',
                                                padding: '4px 8px',
                                                minWidth: '50px'
                                            }}
                                        >
                                            {playbackRate}x
                                        </Button>
                                    </Dropdown>

                                    {/* Fullscreen */}
                                    <Button
                                        type="text"
                                        icon={<FullscreenOutlined />}
                                        onClick={toggleFullscreen}
                                        style={{
                                            color: '#fff',
                                            fontSize: '18px',
                                            padding: '4px 8px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Episode List Section */}
                <div style={{ flex: '1', minHeight: '500px' }}>
                    <h3 style={{
                        marginBottom: '16px',
                        color: '#1890ff',
                        padding: '12px',
                        backgroundColor: '#f0f8ff',
                        borderRadius: '8px',
                        border: '1px solid #d6e4ff'
                    }}>
                        Danh sách tập ({episodeList.length})
                    </h3>
                    <List
                        itemLayout="horizontal"
                        dataSource={episodeList}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '8px',
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        renderItem={(episodeList, index) => (
                            <List.Item
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: currentEpisode === index ? '#f0f8ff' : 'transparent',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '8px',
                                    border: currentEpisode === index ? '2px solid #1890ff' : '1px solid #f0f0f0',
                                    transition: 'all 0.3s ease',
                                    boxShadow: currentEpisode === index ? '0 2px 8px rgba(24,144,255,0.2)' : 'none'
                                }}
                                onClick={() => handleEpisodeChange(index)}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            size={60}
                                            style={{
                                                borderRadius: '8px',
                                                backgroundColor: currentEpisode === index ? '#1890ff' : '#f0f0f0',
                                                color: currentEpisode === index ? '#fff' : '#666',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {index + 1}
                                        </Avatar>
                                    }
                                    title={
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                fontWeight: currentEpisode === index ? 'bold' : 'normal',
                                                color: currentEpisode === index ? '#1890ff' : '#000',
                                                fontSize: '14px'
                                            }}>
                                                {episodeList.title}
                                            </span>
                                            {currentEpisode === index && (
                                                <span style={{
                                                    color: '#52c41a',
                                                    fontSize: '12px',
                                                    backgroundColor: '#f6ffed',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #b7eb8f'
                                                }}>
                                                    Đang phát
                                                </span>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            marginTop: '4px',
                                            padding: '4px 8px',
                                            backgroundColor: '#fafafa',
                                            borderRadius: '4px',
                                            border: '1px solid #f0f0f0'
                                        }}>
                                            <div>Thời lượng: ~24 phút</div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        </Drawer>
    )
}

export default ModalEpisodeList