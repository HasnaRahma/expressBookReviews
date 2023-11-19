const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    if(req.body.isbn)
    {
        const isbn = req.body.isbn;
        res.send(books[isbn])
    }    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    if(req.body.author)
    {
        const authorName = req.body.author;
        let matches = []
        for (const [key, book] of Object.entries(books)) {
            if (book.author === authorName) {
              matches.push({ id: key, book: book })
            }
          }
          (matches.length !==0) ? res.send(matches) :
           res.send("No matching book found !"); // Return null if no matching book is found
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    if(req.body.title)
    {
        const title = req.body.title;
        let matches = []
        for (const [key, book] of Object.entries(books)) {
            if (book.title === title) {
              matches.push({ id: key, book: book })
            }
          }
          (matches.length !==0) ? res.send(matches) :
           res.send("No matching book found !"); // Return null if no matching book is found
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    if(req.body.isbn)
    {
        const isbn = req.body.isbn;
        res.send({reviews:books[isbn].reviews})
    }else {
        res.send("Please provide an ISBN !")
    }
});

module.exports.general = public_users;
