import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const getUsers = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token Invalid");

    const q =
      "UPDATE users SET `name`=? ,`username`=?, `location` = ?, `email`=?, `password`=?,`coverphoto`=?,`profilepic`=? WHERE id=?";
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    db.query(
      q,
      [
        req.body.name,
        req.body.username,
        req.body.location,
        req.body.email,
        hashedPassword,
        req.body.coverphoto,
        req.body.profilepic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(403).json(err);

        if (data.affectedRows > 0)
          return res.status(200).json("User has been updated");

        return res.status(403).json("You can only update your Profile");
      }
    );
  });
};
