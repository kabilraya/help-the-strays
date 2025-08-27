import "./Home.scss";
import Posts from "../../components/Posts/Posts";
import Share from "../../components/Share/share";
const Home = () => {
  return (
    <div className="home">
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
