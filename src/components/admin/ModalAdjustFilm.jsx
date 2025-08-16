import { Badge, Button, Col, Descriptions, Drawer, Image, Popconfirm, Row, Table, Typography } from 'antd'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { FORMAT_DATE_DISPLAY } from '../../services/constant-date';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { fetchSeasonsOfFilmAPI } from '../../services/api-handle';
import ModalEpisode from './ModalEpisode';

const ModalAdjustFilm = (props) => {
    const { openViewDetail, setOpenViewDetail, dataDetail, setDataDetail, } = props;
    const [modalAddSeason, setModalAppSeason] = useState(false)
    const [modalAddEpisode, setModalAddEpisode] = useState(false)

    const [dataSeason, setDataSeason] = useState([])

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [sortQuery, setSortQuery] = useState("");
    const [filter, setFilter] = useState("");

    const { Title } = Typography;
    console.log(dataDetail?.id)

    useEffect(() => {
        if (dataDetail && dataDetail.id) {
            refetchData();
        }
    }, [current, pageSize, sortQuery, filter, dataDetail]);

    const refetchData = async () => {
        if (!dataDetail || !dataDetail.id) return;
        // add filter (later)
        let queryString = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            queryString += filter;
        }
        if (sortQuery) {
            queryString += sortQuery;
        }
        const res = await fetchSeasonsOfFilmAPI(dataDetail.id, queryString);
        if (res && res.data) {
            setDataSeason(res.data.result);
            setTotal(res.data.meta.total);
        }
    }

    const onClose = () => {
        setOpenViewDetail(false);
        setDataDetail(null);
    }

    const columns = [
        {
            title: "Season Name",
            dataIndex: "name",
            width: "32%",
        },
        {
            title: "Dạng Anime",
            dataIndex: "type",
        },
        {
            title: "Release Year",
            dataIndex: "releaseYear",
        },
        {
            title: "Upload Date",
            dataIndex: "uploadDate",
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{moment(record.uploadDate).format(FORMAT_DATE_DISPLAY)}</>
                )
            }
        },
        {
            title: "Thêm tập phim",
            dataIndex: "completion",
            render: (_, record) => {
                return (
                    <>

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa?"}
                            description={"Bạn chắc chắn xóa mùa Anime này ?"}
                            // onConfirm={() => handleDeleteBook(record._id)}
                            okText="OK"
                            cancelText="Hủy bỏ"
                        >
                            <span style={{ cursor: "pointer", margin: "0 20px" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                        <EditTwoTone
                            twoToneColor="green" style={{ cursor: "pointer" }}
                            onClick={() => {
                                setModalAddEpisode(true);
                            }}
                        />
                    </>
                )
            }
        },
    ];

    const dataSource = Array.isArray(dataSeason) ? dataSeason.map((film, idx) => ({
        name: (
            <>
                <Image.PreviewGroup>
                    <Image className="shape-avatar" width={50}
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/visual/haha.jpg`} alt="" />
                    <div className="avatar-info" style={{ display: "inline-block", marginLeft: "5px", cursor: "pointer" }}>
                        <Title level={5}>{film.seasonName || 'No Name'}</Title>
                    </div>
                </Image.PreviewGroup>
            </>
        ),
        type: (
            <>
                <div className="semibold">{film.type || '---'}</div>
            </>
        ),
        releaseYear: (
            <>
                <div className="text-sm">{film.releaseYear || '@-@-@'}</div>
            </>
        ),
        uploadDate: (
            <>
                <div className="text-sm">{film.uploadDate || '---'}</div>
            </>
        ),
    })) : [];
    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                <h3 style={{ fontSize: "20px" }}>List Seasons/Movies</h3>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary" onClick={() => {
                            setModalAppSeason(true);
                        }}
                    >Thêm Season/Movie/OVA</Button>
                    <Button type='ghost' >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }
    return (
        <div>
            <Drawer
                title="Chỉnh sửa thông tin phim"
                width={"70vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin của Anime"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Tên Phim">{dataDetail?.name}</Descriptions.Item>
                    <Descriptions.Item label="Xưởng Phim">{dataDetail?.studio}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>

                        {dataDetail?.categories.map(item => " | " + item.name)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {moment(dataDetail?.uploadDate).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                </Descriptions>
                <Row gutter={24}>
                    <Col span={24} className="gutter-row">
                        <Table
                            title={renderHeader}
                            columns={columns}
                            rowKey="_id"
                            dataSource={dataSource}
                            pagination={{
                                current: current,
                                pageSize: pageSize,
                                total: total,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                showSizeChanger: true
                            }} />
                    </Col>
                </Row>
            </Drawer>
            <ModalEpisode modalAddEpisode={modalAddEpisode}
                setModalAddEpisode={setModalAddEpisode} />
        </div>
    )
}

export default ModalAdjustFilm