import ClientHeader from "../header/clientHeader";
import "./mainStyles.scss";
import { Col, Divider, Pagination, Rate, Row, Tabs } from "antd";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { IoIosPlayCircle } from "react-icons/io";
import { FaStar } from "react-icons/fa";
const MainContent = () => {
  return (
    <div className="god-overrall">
      <div className="header-content">
        <ClientHeader />
      </div>
      <div className="content-container">
        <div className="content-row">
          <p className="content-tag">Recently Updated</p>
          <Row gutter={[20, 20]}>
            <Col md={5} sm={0} xs={0}>
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "rgb(255, 255, 255, .3)",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <FilterTwoTone />
                    <span style={{ fontWeight: 500 }}>
                      Top Ranking of Weeks
                    </span>
                  </span>
                </div>
                <Divider />
              </div>
            </Col>
            <Col md={19} xs={24}>
              <div
                style={{
                  padding: "20px",
                  background: "rgb(255, 255, 255, .1)",
                  borderRadius: 5,
                }}
              >
                <Row className="customize-row">
                  <div className="column">
                    <div className="wrapper">
                      <a href="#" className="film-thumbnail">
                        <img
                          className="film-poster"
                          src="/sug-1.webp"
                          alt="thumbnail book"
                        />
                        <span className="film-star">
                          <FaStar /> 9.7
                        </span>
                        <span className="film-episode">Full</span>
                        <span className="film-title">
                          Viotlet Evegarden | The Movie
                        </span>
                        <span className="film-play-btn">
                          <IoIosPlayCircle />
                        </span>
                      </a>
                    </div>
                  </div>
                </Row>
                <div style={{ marginTop: 30 }}>hihihihi</div>
                <Row style={{ display: "flex", justifyContent: "center" }}>
                  hieu
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default MainContent;
