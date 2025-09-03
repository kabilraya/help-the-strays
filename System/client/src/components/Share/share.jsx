import "./share.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Image from "../../assets/8.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      setCaption("");
      setFile(null);
      setError("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      setError("Failed to create post. Please Try Again.");
    },
  });

  const checkImageWithML = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8001/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("ML server error");

      const result = await res.json();
      console.log("ML Prediction:", result); // DEBUG: log prediction score
      return result.accepted;
    } catch (err) {
      console.error("ML API error:", err);
      return false;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!caption || !caption.trim()) {
      setError(
        file
          ? "Text is required when adding an image"
          : "Text is required for your post"
      );
      return;
    }

    setError("");

    try {
      let imgUrl = null;
      if (file) {
        const isAnimal = await checkImageWithML();
        if (!isAnimal) {
          setError("Not Allowed: Uploaded image is not an animal");
          return;
        }
        imgUrl = await upload();
      }

      mutation.mutate({
        caption: caption.trim(),
        image: imgUrl,
      });
    } catch (err) {
      setError("Failed to upload image. Please try again");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/uploads/" + currentUser.profilepic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="right">
            {file && (
              <div className="file-preview">
                <img
                  className="file"
                  alt="Preview"
                  src={URL.createObjectURL(file)}
                />
                <button className="remove-file" onClick={handleRemoveFile}>
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
