import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getRelationships = (req, res) => {
  const q = "SELECT followerUserId from relationships WHERE followedUserId=?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Token Invalid");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Not Logged in ");

    const q =
      "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?) ";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(501).json(err);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Token Invalid");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Not Logged in ");

    const q =
      "DELETE FROM relationships WHERE followerUserId=? AND followedUserId=?";
    const values = [userInfo.id, req.query.userId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(501).json(err);
      return res.status(200).json("Unfollowed");
    });
  });
};
