import {
  Row, Col, Card, Radio, Table, Button, Avatar, Typography
} from "antd";

import face from "../../assets/images/face-1.jpg";
import face2 from "../../assets/images/face-2.jpg";
import face3 from "../../assets/images/face-3.jpg";

const UserManage = () => {
  const { Title } = Typography;
  // table code start
  const columns = [
    {
      title: "AUTHOR",
      dataIndex: "name",
      key: "name",
      width: "32%",
    },
    {
      title: "FUNCTION",
      dataIndex: "function",
      key: "function",
    },

    {
      title: "STATUS",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "EMPLOYED",
      key: "employed",
      dataIndex: "employed",
    },
  ];

  const data = [
    {
      key: "1",
      name: (
        <>
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={face2}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>Pham Trung Hieu</Title>
              <p>hieu.pt233404@mail.com</p>
            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <>
          <div className="author-info">
            <Title level={5}>Manager</Title>
            <p>Organization</p>
          </div>
        </>
      ),

      status: (
        <>
          <Button type="primary" className="tag-primary">
            ONLINE
          </Button>
        </>
      ),
      employed: (
        <>
          <div className="ant-employed">
            <span>23/04/23</span>
            <a href="#pablo">Edit</a>
          </div>
        </>
      ),
    },

    {
      key: "2",
      name: (
        <>
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={face3}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>Nguyen Phuong Thao</Title>
              <p>alexa@mail.com</p>
            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <>
          <div className="author-info">
            <Title level={5}>Programator</Title>
            <p>Developer</p>
          </div>
        </>
      ),

      status: (
        <>
          <Button className="tag-badge">ONLINE</Button>
        </>
      ),
      employed: (
        <>
          <div className="ant-employed">
            <span>23/12/23</span>
            <a href="#pablo">Edit</a>
          </div>
        </>
      ),
    },

    {
      key: "3",
      name: (
        <>
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={face}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>Tran Thi Mai Phuong</Title>
              <p>laure@mail.com</p>
            </div>
          </Avatar.Group>{" "}
        </>
      ),
      function: (
        <>
          <div className="author-info">
            <Title level={5}>User</Title>
            <p>normal</p>
          </div>
        </>
      ),

      status: (
        <>
          <Button type="primary" className="tag-primary">
            ONLINE
          </Button>
        </>
      ),
      Joined: (
        <>
          <div className="ant-employed">
            <span>03/04/24</span>
            <a href="#pablo">Edit</a>
          </div>
        </>
      ),
    },

  ];
  return (
    <Row gutter={[24, 0]}>
      <Col xs="24" xl={24}>
        <Card
          bordered={false}
          className="criclebox tablespace mb-24"
          title="Authors Table"
          extra={
            <>
              <Radio.Group defaultValue="a">
                <Radio.Button value="a">All</Radio.Button>
                <Radio.Button value="b">ONLINE</Radio.Button>
              </Radio.Group>
            </>
          }
        >
          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              className="ant-border-space"
            />
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default UserManage