import "./NavBar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { AuthContext } from "../../context/authContext";
import PetsIcon from "@mui/icons-material/Pets";
import { makeRequest } from "../../axios";
const NavBar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const logout = async (e) => {
    try {
      await makeRequest.post("/auth/logout");
      localStorage.removeItem("user");
    } catch (err) {
      console.log(err.response.data);
    }
    navigate("/login");
  };
  return (
    <div className="NavBar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>
            <PetsIcon></PetsIcon>Help the Strays
          </span>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon />
        </Link>

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

        <div className="user" onClick={() => setOpenDropdown(!openDropdown)}>
          <img
            src={"/uploads/" + currentUser.profilepic}
            loading="lazy"
            alt="Profile Picture"
          ></img>
          <span>{currentUser.username}</span>
        </div>
        {openDropdown && (
          <div className="dropdown">
            <Link to={`/profile/${currentUser.id}`}>Profile</Link>
            <span onClick={logout}>Logout</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default NavBar;
