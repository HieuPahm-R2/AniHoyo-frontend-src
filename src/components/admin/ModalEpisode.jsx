import { InboxOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import React from 'react'

const ModalEpisode = (props) => {
    const { modalAddEpisode, setModalAddEpisode } = props

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "video/mp4,video/x-matroska,video/webm,video/avi,video/quicktime",
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
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
            onOk={() => setModalAddEpisode(false)}
            onCancel={() => setModalAddEpisode(false)}
        >
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
        </Modal>
    )
}

export default ModalEpisode