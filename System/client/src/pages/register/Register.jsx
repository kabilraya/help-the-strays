import { useState } from "react";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const [err, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/auth/register", inputs);
    } catch (err) {
      setError(err.response.data);
    }
    navigate("/login");
  };

  return (
    <div className="main">
      <div className="card">
        <div className="left">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            ></input>
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            ></input>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            ></input>
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            ></input>
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
        <div className="right">
          <h1>Save The Stray Animals</h1>
          <p>Bringing together the community to help the poor stray animals</p>
          <span>Already have an account??</span>
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
