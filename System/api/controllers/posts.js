import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { predictCategory } from "../categorizer.js";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const category = req.query.category;
  const token = req.cookies.accessToken;

  console.log("Query parameters:", { userId, category });

  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    let q = "";
    let values = [];

    console.log("Processing request with:", { userId, category });

    if (userId && !category) {
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
      console.log("Fetching user posts for userId:", userId);
    } else if (category && !userId) {
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
      console.log("Fetching category posts for category:", category);
    } else if (category && userId) {
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
        WHERE p.userid = ? AND p.category = ?
        GROUP BY p.id
        ORDER BY likeCount DESC
      `;
      values = [userId, category];
      console.log("Fetching user's category posts:", { userId, category });
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
      console.log("Fetching all posts");
    }

    console.log("Executing query:", q);
    console.log("With values:", values);

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json(err);
      }

      console.log(`Found ${data.length} posts`);
      if (data.length > 0) {
        console.log("First post category:", data[0].category);
      }

      return res.status(200).json(data);
    });
  });
};

export const addPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    const category = predictCategory(req.body.caption);
    const q =
      "INSERT INTO posts (`captions`,`image`,`createddate`,`userid`,`category`) VALUES (?)";

    const values = [
      req.body.caption,
      req.body.image,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      category,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};
