import "./NavBar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { AuthContext } from "../../context/authContext";
const NavBar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="NavBar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>PROTECT STRAYS</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <LightModeOutlinedIcon onClick={toggle} />
        ) : (
          <BedtimeOutlinedIcon onClick={toggle} />
        )}

        <VolunteerActivismOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search"></input>
        </div>
      </div>
      <div className="right">
        <AccountCircleOutlinedIcon />
        <NotificationsNoneOutlinedIcon />
        <Link to={`/profile/${currentUser.id}`}>
          <div className="user">
            <img
              src={"/uploads/" + currentUser.profilepic}
              loading="lazy"
              alt="Profile Picture"
            ></img>
            <span>{currentUser.username}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default NavBar;
