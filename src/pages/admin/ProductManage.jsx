import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Typography,
  Image,
  Popconfirm
} from "antd";
import moment from "moment";
import { DeleteTwoTone, EditTwoTone, PlusOutlined, ReloadOutlined, ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import pencil from "../../assets/images/pencil.svg";
import { useEffect, useState } from "react";
import ModalCreate from "../../components/admin/ModalCreate";
import { fetchDataFilmsAPI } from "../../services/api-handle";
import { FORMAT_DATE_DISPLAY } from "../../services/constant-date";
import ModalUpdate from "../../components/admin/ModalUpdate";
const ProductManage = () => {
  const { Title } = Typography;

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);

  const [dataUpdate, setDataUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFilm, setDataFilm] = useState([]);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState("");
  const [filter, setFilter] = useState("");


  useEffect(() => {
    refetchData()
  }, [current, pageSize, sortQuery, filter])
  const refetchData = async () => {
    setIsLoading(true);
    // add filter (later)
    let queryString = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      queryString += filter;
    }
    if (sortQuery) {
      queryString += sortQuery;
    }
    const res = await fetchDataFilmsAPI(queryString);
    if (res && res.data) {
      setDataFilm(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  }
  // project table start
  const project = [
    {
      title: "Film/Movie Name",
      dataIndex: "name",
      width: "32%",
    },
    {
      title: "Studio Production",
      dataIndex: "studio",
    },
    {
      title: "Release Year",
      dataIndex: "releaseYear",
    },
    {
      title: "Updated Time",
      dataIndex: "uploadDate",
      sorter: true,
      render: (text, record, index) => {
        return (
          <>{moment(record.updated).format(FORMAT_DATE_DISPLAY)}</>
        )
      }
    },
    {
      title: "COMPLETION",
      dataIndex: "completion",
      render: (_, record) => {
        return (
          <>
            <div className="ant-progress-project">
              <Progress percent={20} size="small" />
              <Popconfirm
                placement="leftTop"
                title={"Xác nhận xóa"}
                description={"Bạn chắc chắn muốn xóa phim này ?"}
                // onConfirm={() => handleDeleteBook(record._id)}
                okText="OK"
                cancelText="Hủy"
              >
                <span style={{ cursor: "pointer", margin: "0 20px" }}>
                  <DeleteTwoTone twoToneColor="#ff4d4f" />
                </span>
              </Popconfirm>

              <EditTwoTone
                twoToneColor="#f57800" style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpenModalUpdate(true);
                  setDataUpdate(record);
                }}
              />
            </div>

          </>
        )
      }
    },
  ];
  // Tạo dataproject động từ dataFilm, đảm bảo dataFilm luôn là mảng
  const dataproject = Array.isArray(dataFilm) ? dataFilm.map((film, idx) => ({
    // key: film.id || idx,
    name: (
      <>
        <Image.PreviewGroup>
          <Image className="shape-avatar" width={50}
            src={`${import.meta.env.VITE_BACKEND_URL}/storage/thumbnail/${film.thumbnail}`} alt="" />
          <div className="avatar-info" style={{ display: "inline-block", marginLeft: "5px" }}>
            <Title level={5}>{film.name || 'No Name'}</Title>
          </div>
        </Image.PreviewGroup>
      </>
    ),
    studio: (
      <>
        <div className="semibold">{film.studio || '---'}</div>
      </>
    ),
    releaseYear: (
      <>
        <div className="text-sm">{film.releaseYear || '@-@-@'}</div>
      </>
    ),
    uploadTime: (
      <>
        <div className="text-sm">{film.uploadDate || '---'}</div>
      </>
    ),
  })) : [];

  return (
    <Row gutter={[24, 0]}>
      <Col xs="24" xl={24}>
        <Card
          className="criclebox tablespace mb-24"
          title="Projects Table"
          extra={
            <>
              <span style={{ display: 'flex', gap: 15 }}>
                <Button
                  onClick={() => {
                    setOpenModalCreate(true);
                  }}
                  icon={<PlusOutlined />}
                  type="primary">Thêm mới</Button>
                <Button type='dashed'>
                  <ReloadOutlined /> Làm mới
                </Button>
              </span>
            </>
          }
        >
          <div className="table-responsive">
            <Table
              columns={project}
              dataSource={dataproject}
              loading={isLoading}
              pagination={{
                current: current,
                pageSize: pageSize,
                total: total,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true
              }}
              className="ant-border-space"
            />
          </div>
        </Card>
      </Col>
      <ModalCreate openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refetchData={refetchData} />
      <ModalUpdate openModalUpdate={openModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refetchData={refetchData} />
    </Row>
  )
}

export default ProductManage