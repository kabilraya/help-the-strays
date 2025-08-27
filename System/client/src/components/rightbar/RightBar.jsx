import "./RightBar.scss";
import Vaccination from "../../assets/Vaccination.png";
import Adoption from "../../assets/Adoption.png";
import AnimalAbuse from "../../assets/Abuse.png";
import Help from "../../assets/Help.png";
const RightBar = () => {
  return (
    <div className="RightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="userinfo">
              <img
                src="https://i.pinimg.com/736x/0c/13/71/0c13710ed387003ed6a95a353c592245.jpg"
                alt="friend"
              />
              <span>Jane Doe</span>
            </div>

            <div className="buttons">
              <button>Accept</button>
              <button>Decline</button>
            </div>
          </div>
          <div className="user">
            <div className="userinfo">
              <img
                src="https://i.pinimg.com/736x/b4/be/2a/b4be2a5c52b166134c6a6b219836dcb1.jpg"
                alt="friend"
              />
              <span>Kabil Raya</span>
            </div>

            <div className="buttons">
              <button>Accept</button>
              <button>Decline</button>
            </div>
          </div>
        </div>
        <div className="item">
          <span>New Category Messages</span>
          <div className="notification">
            <img src={Adoption} alt="adoption" />
            <span>New post in Adoption</span>
          </div>
          <div className="notification">
            <img src={Vaccination} alt="vaccination" />
            <span>New post in Vaccination</span>
          </div>
          <div className="notification">
            <img src={AnimalAbuse} alt="abuse" />
            <span>New post in Animal Abuse</span>
          </div>
          <div className="notification">
            <img src={Help} alt="help" />
            <span>New post in Help Needed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightBar;
