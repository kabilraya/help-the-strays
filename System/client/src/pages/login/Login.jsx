import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const [err, setError] = useState(null);

  const { currentUser, login } = useContext(AuthContext);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (currentUser) {
  //     navigate("/");
  //   }
  // }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!inputs.username.trim() || !inputs.password.trim()) {
      setError("Both username and password are required.");
      return;
    }
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="Login">
      <div className="card">
        <div className="left">
          <h1>Save The Stray Animals</h1>
          <p>
            Welcome to Stray Animals Welfare Page. Let's bring the community
            together to help the stray animals.
          </p>
          <span>Don't Have An Account Yet??</span>
          <Link to={"/register"}>
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            ></input>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            ></input>
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
