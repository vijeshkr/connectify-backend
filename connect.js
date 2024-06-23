import mysql from 'mysql';

export const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Asd#1234',
    database:'connectify'
});