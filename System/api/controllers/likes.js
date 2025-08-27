import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getLikes = (req, res) => {
  const q = "SELECT likeeUserId FROM likes where likePostId=?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.likeeUserId));
  });
};
export const postLikes = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged In");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is Invalid");

    const q = "INSERT INTO likes (`likeeUserId`,`likePostId`) VALUES (?)";
    const values = [userInfo.id, req.query.postId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been Liked");
    });
  });
};

export const deleteLikes = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User is not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token");

    const q = "DELETE FROM likes where likeeUserId=? AND likePostId=?";
    const values = [userInfo.id, req.query.postId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Post has been disliked");
    });
  });
};
