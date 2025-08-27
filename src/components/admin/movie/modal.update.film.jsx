import { Col, Divider, Form, Input, InputNumber, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { callCreateFilmAPI, callUpdateFilmAPI, callUploadImage, fetchFilmCategory, fetchFilmTags } from '@/config/api.handle';
import { v4 as uuidv4 } from 'uuid';

const ModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate, refetchData } = props;
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSliderLoading, setIsSliderLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

    const [initForm, setInitForm] = useState(null);

    const [isSubmit, setIsSubmit] = useState(false);
    const [listCategories, setListCategories] = useState([]);
    const [listTags, setListTags] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetchFilmCategory();
            if (res && res.data) {
                const accept = res.data.result.map((item) => ({
                    label: item.name,
                    value: item.id
                }))
                setListCategories(accept);
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
        if (dataUpdate?._id) {
            const arrThumbnail = [{
                uid: uuidv4(),
                name: dataUpdate.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/storage/thumbnail/${dataUpdate.thumbnail}`,
            }]
            const arrSlider = [{
                uid: uuidv4(),
                name: dataUpdate.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/storage/slider/${dataUpdate.slider}`,
            }]
            const initialVal = {
                id: dataUpdate.id,
                name: dataUpdate.name,
                studio: dataUpdate.studio,
                description: dataUpdate.description,
                releaseYear: dataUpdate.releaseYear,
                tag: dataUpdate.tag,
                category: dataUpdate.category,
                thumbnail: {
                    fileList: arrThumbnail
                },
                slider: {
                    fileList: arrSlider
                }
            }
            setInitForm(initialVal);
            setDataThumbnail(arrThumbnail);
            setDataSlider(arrSlider);
            form.setFieldsValue(initialVal);
        }
        return () => { form.resetFields() };

    }, [dataUpdate]);

    const onFinish = async (values) => {
        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh thumbnail'
            })
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh slider'
            })
            return;
        }
        setIsSubmit(true);
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider[0].name;
        const { id, name, studio, description, tag, releaseYear, category } = values;
        console.log(values);
        const res = await callUpdateFilmAPI(
            id, thumbnail, slider, name, studio, description, tag, releaseYear, category
        );
        if (res && res.data) {
            setOpenModalUpdate(false);
            setInitForm(null);
            setDataThumbnail([]);
            setDataSlider([]);
            form.resetFields();
            await refetchData();
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Cập nhật thành công'
            })

        } else {
            notification.error({
                message: 'Cập nhật thất bại',
                description: res.message
            })
        }
        setIsSubmit(false);
    }
    const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
        console.log("handleUploadThumbnail called");
        const res_thumb = await callUploadImage(file, "thumbnail");
        console.log(res_thumb.data)
        if (res_thumb && res_thumb.data) {
            setDataThumbnail([{
                name: res_thumb.data.fileName,
                uid: uuidv4()
            }]);
            onSuccess("Tải ảnh thành công!");
            message.success("done")
        } else {
            onError("Lỗi tải ảnh!");
        }
    };
    const handleUploadSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadImage(file, "slider");
        if (res && res.data) {
            setDataSlider([{
                name: res.data.fileName,
                uid: uuidv4()
            }]);
            onSuccess("Tải ảnh thành công!");
        } else {
            onError("Lỗi tải ảnh!");
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };
    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            setDataSlider([]);
        }
    }
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG or webp file!');
        }
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isLt3M) {
            message.error('Image must smaller than 3MB!');
        }
        return isJpgOrPng && isLt3M;
    };
    const handleChange = async (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setIsSliderLoading(true) : setIsLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setIsSliderLoading(false) : setIsLoading(false);
                setImageUrl(url);
            });
        }
    };
    return (
        <>
            <Modal
                title="Chỉnh sửa thông tin phim"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                okText={"Cập Nhật"}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalUpdate(false);
                }}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                //do not close when click fetchBook
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col hidden>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="ID Film"
                                name="id"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên Phim"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                style={{ borderRadius: "5px" }}
                                label="Studio Production"
                                name="studio"
                                rules={[{ required: true, message: 'Vui lòng nhập tên xưởng làm phim!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mô tả / Giới Thiệu"
                                name="description"
                                rules={[{ required: true, message: 'Không giới thiệu phim à??!' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    options={listCategories}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Highlight Tag"
                                name="tag"
                                rules={[{ required: true, message: 'Vui lòng chọn tag phim!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    options={listTags}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadThumbnail}
                                    beforeUpload={beforeUpload}
                                    onRemove={file => handleRemoveFile(file, 'thumbnail')}
                                    onPreview={handlePreview}
                                    showUploadList={{
                                        showPreviewIcon: true,
                                        showRemoveIcon: true,
                                    }}
                                >
                                    <div>
                                        {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    beforeUpload={beforeUpload}
                                    onChange={info => handleChange(info, 'slider')}
                                    onRemove={file => handleRemoveFile(file, 'slider')}
                                    onPreview={handlePreview}
                                    customRequest={handleUploadSlider}
                                    showUploadList={{
                                        showPreviewIcon: true,
                                        showRemoveIcon: true,
                                    }}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Năm Phát Hành"
                                name="releaseYear"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>


                    </Row>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>

        </>
    )
}

export default ModalUpdate