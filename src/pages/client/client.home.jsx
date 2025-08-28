import { useEffect } from "react";
import Banner from "../../components/client/Banner";
import CommingSoon from "../../components/client/CommingSoon";
import Content from "../../components/client/Content";
import Featured from "../../components/client/Featured";
import { convertSlug } from "../../config/utils";
import { useNavigate } from "react-router-dom";


const ClientHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("client-theme");
    return () => {
      document.body.classList.remove("client-theme");
    };
  }, []);


  const handleRedirect = (book) => {
    const slug = convertSlug(book.seasonName);
    navigate(`/detail/${slug}?id=${book.id}`)
  }

  return (
    <div className="client__container" >
      <Banner />
      <Featured handleRedirect={handleRedirect} />
      <Content handleRedirect={handleRedirect} />
      <CommingSoon />
    </div>
  );
};
export default ClientHome;
