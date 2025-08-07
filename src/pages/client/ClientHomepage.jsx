import { useEffect } from "react";
import Banner from "../../components/client/Banner";
import CommingSoon from "../../components/client/CommingSoon";
import Content from "../../components/client/Content";
import Featured from "../../components/client/Featured";


const ClientHome = () => {
  useEffect(() => {
    document.body.classList.add("client-theme");
    return () => {
      document.body.classList.remove("client-theme");
    };
  }, []);

  return (
    <div className="client__container" >
      <Banner />
      <Featured />
      <Content />
      <CommingSoon />
    </div>
  );
};
export default ClientHome;
