import "./LeftBar.scss";
import Friends from "../../assets/1.png";
import Organization from "../../assets/3.png";
import Message from "../../assets/10.png";
import Videos from "../../assets/4.png";
import Photos from "../../assets/8.png";
import Vaccination from "../../assets/Vaccination.png";
import Adoption from "../../assets/Adoption.png";
import AnimalAbuse from "../../assets/Abuse.png";
import Help from "../../assets/Help.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={"/uploads/" + currentUser.profilepic} alt="Profile"></img>
            <span>{currentUser.name}</span>
          </div>
          <div className="items">
            <img
              src={Friends}
              style={{ width: 25, height: 25 }}
              alt="friends"
            ></img>
            <span>Friends</span>
          </div>
          <div className="items">
            <img
              src={Message}
              style={{ width: 25, height: 25 }}
              alt="message"
            ></img>
            <span>Messages</span>
          </div>
          <div className="items">
            <img
              src={Videos}
              style={{ width: 25, height: 25 }}
              alt="dynamic"
            ></img>
            <span>Videos</span>
          </div>
          <div className="items">
            <img
              src={Photos}
              style={{ width: 25, height: 25 }}
              alt="static-post"
            ></img>
            <span>Images</span>
          </div>
          <div className="items">
            <img
              src={Organization}
              style={{ width: 25, height: 25 }}
              alt="organizations"
            ></img>
            <span>Communities</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Categories</span>
          <Link to="/category/Adoption">
            <div className="items">
              <img
                src={Adoption}
                alt="adoption"
                style={{ width: 25, height: 25 }}
              ></img>
              <span>Adoption</span>
            </div>
          </Link>
          <Link to="/category/Vaccination">
            <div className="items">
              <img
                src={Vaccination}
                style={{ width: 25, height: 25 }}
                alt="vaccination"
              ></img>
              <span>Vaccination</span>
            </div>
          </Link>
          <Link to="/category/Help">
            <div className="items">
              <img
                src={Help}
                style={{ width: 25, height: 25 }}
                alt="help"
              ></img>
              <span>Help Needed</span>
            </div>
          </Link>
          <Link to="/category/Illegal Activities">
            <div className="items">
              <img
                src={AnimalAbuse}
                style={{ width: 25, height: 25 }}
                alt="abuse"
              ></img>
              <span>Animal Abuse</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LeftBar;
