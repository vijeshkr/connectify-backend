import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from 'jsonwebtoken';

export const getPosts = (req,res) => {
    
    // Get the user id from the query parameters
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json('Not logged in');
    }


jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) {
        return res.status(403).json('Token is not valid');
    }

    // Get posts by a specific user or posts by the user and followed users
    const q = userId ? `SELECT p.*, u.id AS userId, name,profilePic FROM posts AS p JOIN users AS u ON u.id = p.userId WHERE p.userId = ?` 
    :`SELECT p.*,u.id AS userId, name, profilePic
     FROM posts AS p 
     JOIN users AS u ON u.id = p.userId 
     LEFT JOIN relationships AS r ON p.userId = r.followedUserId 
     WHERE r.followerUserId = ? OR p.userId = ? 
     ORDER BY p.createdAt DESC`;

     const values = userId ? [userId] : [userInfo.id,userInfo.id]

    db.query(q, values, (err,data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

    
};

// Add posts

export const addPost = (req,res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json('Not logged in');
    }


jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) {
        return res.status(403).json('Token is not valid');
    }


    const q = 'INSERT INTO posts (`desc`,`img`,`createdAt`,`userId`) VALUES (?, ?, ?, ?)';

    const values = [
        req.body.desc,
        req.body.img,
        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        userInfo.id,
    ]

    db.query(q, values, (err,data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json('Post has been created');
    });
});

};

// Delete post

export const deletePost = (req,res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json('Not logged in');
    }


jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) {
        return res.status(403).json('Token is not valid');
    }


    const q = 'DELETE FROM posts WHERE `id`=? AND `userId`=?';


    db.query(q, [req.params.id, userInfo.id], (err,data) => {
        if(err) return res.status(500).json(err);
        if (data.affectedRows > 0 ) return res.status(200).json('Post has been deleted');
        return res.status(403).json('You can delete only your post');
    });
});

};