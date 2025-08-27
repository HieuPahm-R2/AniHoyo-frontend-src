import { InboxOutlined } from '@ant-design/icons'
import { Input, InputNumber, message, Modal } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import React, { useEffect, useState } from 'react'
import { createEpisodeAPI, uploadVideoAPI } from '@/config/api.handle'
import ModalEpisodeList from './modal.view.episode'

const ModalEpisodeUpload = (props) => {
    const { modalAddEpisode, setModalAddEpisode, selectedSeason } = props
    const [urlVideo, setUrlVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [titleEpisode, setTitleEpisode] = useState("");
    const [contentType, setContentType] = useState("");
    const [dataEpisode, setDataEpisode] = useState([]);


    const handleSubmit = async () => {
        if (!urlVideo) {
            message.error("Vui lòng upload tập phim!");
            return;
        }
        setIsLoading(true);
        const res = await createEpisodeAPI(titleEpisode, urlVideo, contentType, selectedSeason?.id);
        if (res && res.data) {
            notification.success({
                description: `Tải lên tập phim thành công`,
                message: "Upload Done!", s
            })
            setModalAddEpisode(false)
            setIsLoading(false)
            setDataEpisode(res)
            window.location.reload();
        } else {
            notification.error({
                description: res.message,
                message: "Đã có lỗi xảy ra",
            })
            setModalAddEpisode(false)
            setIsLoading(false)
        }
    }
    const setTitleInput = (value) => {
        setTitleEpisode(value);
    }
    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "video/mp4,video/x-matroska,video/webm,video/avi,video/quicktime",
        async customRequest({ file, onSuccess, onError }) {
            const res = await uploadVideoAPI(file, "videos");
            if (res && res.data) {
                setUrlVideo(res.data.fileName);
                if (onSuccess) onSuccess('ok')
            } else {
                if (onError) {
                    setUrlVideo("");
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                message.loading("Chờ xíu...");
            }
            if (status === 'done') {
                if (info.fileList.length > 0 && info.fileList) {
                    setContentType(info.file.type)
                    message.success(`file uploaded successfully.`);
                }
            } else if (status === 'error') {
                message.error(`file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return (
        <Modal
            title="Thêm tập phim"
            centered
            open={modalAddEpisode}
            loading={isLoading}
            onOk={() => handleSubmit()}
            onCancel={() => setModalAddEpisode(false)}
        >
            <Input
                placeholder="tiêu đề Anime | Số tập"
                variant="underlined" style={{ width: 300 }}
                autoFocus={true}
                name={'title'}
                onChange={(e) => setTitleInput(e.target.value)}
            />
            <div style={{ marginTop: "20px", marginBottom: "10px" }}></div>
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">
                    Chỉ hỗ trợ tải lên một lần. Nghiêm cấm tải lên dữ liệu, tài liệu không phù hợp hoặc các thông tin khác
                    tập tin bị cấm.
                </p>
            </Dragger>
            <ModalEpisodeList dataEpisode={dataEpisode} />
        </Modal>

    )
}

export default ModalEpisodeUpload