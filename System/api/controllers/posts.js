import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const category = req.query.category;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    let q = "";
    let values = [];

    if (userId) {
      q = `
        SELECT 
          p.*, 
          u.id AS userid, 
          u.name, 
          u.profilepic,
          COUNT(l.likePostId) AS likeCount
        FROM posts AS p
        JOIN users AS u ON u.id = p.userid
        LEFT JOIN likes AS l ON l.likePostId = p.id
        WHERE p.userid = ?
        GROUP BY p.id
        ORDER BY likeCount DESC
      `;
      values = [userId];
    } else if (category) {
      q = `
        SELECT 
          p.*, 
          u.id AS userid, 
          u.name, 
          u.profilepic,
          COUNT(l.likePostId) AS likeCount
        FROM posts AS p
        JOIN users AS u ON u.id = p.userid
        LEFT JOIN likes AS l ON l.likePostId = p.id
        WHERE p.category = ?
        GROUP BY p.id
        ORDER BY likeCount DESC
      `;
      values = [category];
    } else {
      q = `
        SELECT 
          p.*, 
          u.id AS userid, 
          u.name, 
          u.profilepic,
          COUNT(l.likePostId) AS likeCount
        FROM posts AS p
        JOIN users AS u ON u.id = p.userid
        LEFT JOIN likes AS l ON l.likePostId = p.id
        GROUP BY p.id
        ORDER BY likeCount DESC
      `;
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "INSERT INTO posts (`captions`,`image`,`createddate`,`userid`) VALUES (?)";

    const values = [
      req.body.caption,
      req.body.image,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};
