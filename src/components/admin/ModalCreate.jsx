import React, { useEffect } from 'react'
import { Col, Divider, Form, Input, InputNumber, Modal, notification, Row, Select, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { callUploadImage, fetchFilmCategory, fetchFilmTags } from '../../services/api-handle';
import { v4 as uuidv4 } from 'uuid';
const ModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;

    const [form] = Form.useForm();
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetchFilmCategory();
            if(res && res.data){
                const accept = res.data.map((item) => {
                    return {
                        label: item,
                        value: item
                    }
                })
                setListCategories(accept);
            }
        }
        const fetchTags = async () => {
            const res = await fetchFilmTags();
            if(res && res.data){
                const accept = res.data.map((item) => {
                    return {
                        label: item,
                        value: item
                    }
                })
                setListTags(accept)
            }
        }
    }, [])

    const [isLoading, setIsLoading] = useState(false);
    const [isSliderLoading, setIsSliderLoading] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [listTags, setListTags] = useState([]);

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
        const { name, studio, description, tag,releaseYear, quantity, category } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map((item) => item.name);
        setIsSubmit(true);
        const res = await callCreateBookAPI(thumbnail, slider, mainText, author, price, sold, quantity, category);
        if (res && res.data) {
            notification.success({
                message: 'Thành công',
                description: 'Tạo mới sách thành công'
            })
            setOpenModalCreate(false);
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            await refetchData();
        } else {
            notification.error({
                message: 'Lỗi',
                description: 'Tạo mới sách thất bại'
            })
        }
        setIsSubmit(false);
    }
     // handle upload file
    const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadImage(file,"thumbnail");
        if (res && res.data) {
            setDataThumbnail([{
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
            setDataThumbnail("")
        }
        if (type === 'slider') {
            setDataSlider("");
        }
    }
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG or webp file!');
        }
        const isLt4M = file.size / (1024 * 4) < 4;
        if (!isLt2M) {
            message.error('Image must smaller than 4MB!');
        }
        return isJpgOrPng && isLt4M;
    };
    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setIsSliderLoading(true) : setIsLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setIsSliderLoading(false) : setIsLoading(false);
                // setImageUrl(url);
            });
        }
    };
  return (
     <>
            <Modal
                title="Thêm Phim mới"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                width={"50vw"}
                //do not close when click fetchBook
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    // onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
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
                                label="Năm Phát Hành"
                                name="releaseYear"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        
                        <Col span={12}>
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
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file)}
                                    onPreview={handlePreview}
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
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    multiple
                                    name="slider"
                                   
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            

        </>
  )
}

export default ModalCreate