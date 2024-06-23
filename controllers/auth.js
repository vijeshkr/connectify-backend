import { db } from '../connect.js';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req,res) => {
    // Check user if exists
    
    const q = 'SELECT * FROM users WHERE username = ?';

    db.query(q,[req.body.username], (err,data) => {
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json('User already exist');

     // Create a new user
        // Hash the password
        const salt = bycrypt.genSaltSync(10);
        const hashedPassword = bycrypt.hashSync(req.body.password, salt);

        // User creation
        const q = 'INSERT INTO users (`username`,`email`,`password`,`name`) VALUE(?)';
        const values = [req.body.username,req.body.email,hashedPassword,req.body.name];
        db.query(q,[values],(err,data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json('User has been created');
        });
    });  
};

export const login = (req,res) => {
    const q = 'SELECT * FROM users WHERE username = ?';

    db.query(q,[req.body.username], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json('User not found');
        // Compare the provided password with hashed password in the databas
        const checkPassword = bycrypt.compareSync(req.body.password, data[0].password);

        if(!checkPassword)
            return res.status(400).json('Wrong password or username');
        const token = jwt.sign({ id: data[0].id}, 'secretkey');
        // Extract the password and other details to avoid sending back to the client or cookie
        const { password, ...others} = data[0];

        res.cookie('accessToken',token,{
            httpOnly:true,
        }).status(200).json(others);
    });
}
export const logout = (req,res) => {
    res.clearCookie('accessToken',{
        secure:true,
        sameSite:'none'
    }).status(200).json('User has been logged out');
};