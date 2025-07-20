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
  Image 
} from "antd";
import moment from "moment";
import { PlusOutlined, ReloadOutlined, ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import pencil from "../../assets/images/pencil.svg";
import { useEffect, useState } from "react";
import ModalCreate from "../../components/admin/ModalCreate";
import { fetchDataFilmsAPI } from "../../services/api-handle";
import { FORMAT_DATE_DISPLAY } from "../../services/constant-date";
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
 

  useEffect(() => {
    refetchData()
  }, [])
  const refetchData = async () => {
        setIsLoading(true);
        // add filter (later)
        //.....
        const res = await fetchDataFilmsAPI();
        if (res && res.data) {
            setDataFilm(res.data);
            
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
          <div className="avatar-info" style={{display: "inline-block", marginLeft: "5px"}}>
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
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={20} size="small" />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
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
              refetchData={refetchData}/>
        </Row>
  )
}

export default ProductManage