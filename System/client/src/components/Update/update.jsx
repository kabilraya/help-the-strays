import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./update.scss";
import React, { useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const Update = ({ setOpenUpdate, user }) => {
  const { setCurrentUser } = useContext(AuthContext);

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setText] = useState({
    name: user.name || "",
    username: user.username || "",
    location: user.location || "",
    email: user.email || "",
    password: "",
  });
  const handleChange = (e) => {
    setText((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users", user);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["user"]);

      const { password, ...safeVariables } = variables;
      setCurrentUser((prev) => {
        const updated = { ...prev, ...safeVariables };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    coverUrl = cover ? await upload(cover) : user.coverphoto;
    profileUrl = profile ? await upload(profile) : user.profilepic;

    const payload = {
      ...texts,
      coverphoto: coverUrl,
      profilepic: profileUrl,
    };

    if (!payload.password) {
      delete payload.password;
    }

    mutation.mutate(payload);
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <div className="top">
        <button onClick={() => setOpenUpdate(false)}>X</button>
      </div>
      <div className="bottom">
        <div className="left"></div>
        <div className="right">
          <form>
            <input
              type="file"
              placeholder="CoverPhoto"
              onChange={(e) => setCover(e.target.files[0])}
            ></input>
            {cover && (
              <img
                className="file"
                alt=""
                src={URL.createObjectURL(cover)}
              ></img>
            )}
            <input
              type="file"
              placeholder="ProfilePic"
              onChange={(e) => setProfile(e.target.files[0])}
            ></input>

            {profile && (
              <img
                className="file"
                alt=""
                src={URL.createObjectURL(profile)}
              ></img>
            )}
            <input
              type="text"
              name="name"
              value={texts.name}
              placeholder="Name"
              onChange={handleChange}
            ></input>
            <input
              type="text"
              name="username"
              value={texts.username}
              placeholder="Username"
              onChange={handleChange}
            ></input>
            <input
              type="text"
              name="location"
              value={texts.location}
              placeholder="Location"
              onChange={handleChange}
            ></input>
            <input
              type="email"
              name="email"
              value={texts.email}
              placeholder="Email"
              onChange={handleChange}
            ></input>
            <input
              type="password"
              name="password"
              value={texts.password}
              placeholder="Password"
              onChange={handleChange}
            ></input>
            <button onClick={handleSubmit}>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update;
