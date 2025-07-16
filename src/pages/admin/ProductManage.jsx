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
  Avatar,
  Typography,
} from "antd";

import { PlusOutlined, ReloadOutlined, ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ava1 from "../../assets/images/logo-shopify.svg";
import ava2 from "../../assets/images/logo-atlassian.svg";
import ava3 from "../../assets/images/logo-slack.svg";
import pencil from "../../assets/images/pencil.svg";
import { useState } from "react";
import ModalCreate from "../../components/admin/ModalCreate";
const ProductManage = () => {
  const { Title } = Typography;

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [listFilms, setListFilms] = useState([]);

  // project table start
  const project = [
  {
    title: "FILMS/MOVIE",
    dataIndex: "name",
    width: "32%",
  },
  {
    title: "EPISODES",
    dataIndex: "episode",
  },
  {
    title: "STATUS",
    dataIndex: "address",
  },
  {
    title: "Time Updated",
    dataIndex: "updateTime",
  },
  {
    title: "COMPLETION",
    dataIndex: "completion",
  },
];
  const dataproject = [
  {
    key: "1",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava1} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}>Attack On Titan | Season 1</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    episode: (
      <>
        <div className="semibold">11/14</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={30} size="small" />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "2",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava2} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}>Hibike! Euphonium | Season 3</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    episode: (
      <>
        <div className="semibold">12/30</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">working</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={10} size="small" />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  {
    key: "3",
    name: (
      <>
        <Avatar.Group>
          <Avatar className="shape-avatar" src={ava3} size={25} alt="" />
          <div className="avatar-info">
            <Title level={5}> Jira Platform Errors</Title>
          </div>
        </Avatar.Group>
      </>
    ),
    age: (
      <>
        <div className="semibold">Not Set</div>
      </>
    ),
    address: (
      <>
        <div className="text-sm">done</div>
      </>
    ),
    completion: (
      <>
        <div className="ant-progress-project">
          <Progress percent={100} size="small" format={() => "done"} />
          <span>
            <Link to="/">
              <img src={pencil} alt="" />
            </Link>
          </span>
        </div>
      </>
    ),
  },

  ];
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
              setOpenModalCreate={setOpenModalCreate}/>
        </Row>
  )
}

export default ProductManage