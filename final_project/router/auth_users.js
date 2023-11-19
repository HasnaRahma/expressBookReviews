const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
const isValid = (username)=>{ //returns boolean
    // See first if it doesn't exist already in the DataBase
    if(!doesExist(username))
        return true;
    else 
        return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60*60*60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let book = books[req.body.isbn]
    
    if (book) { //Check if the book exists
        let sessionUser = req.session.authorization.username;
        let review = req.body.review;
        if(review) {
            for (const [key, review] of Object.entries(book.reviews)) {
                if (review.user === sessionUser) {
                    book.reviews[key] = review;
                    return res.send(`Review of the user ${sessionUser} has been updated !`)
                }
            }
            // Case of a new reviw from a different user
            book.reviews.push[{"review":{review}}]        
            return res.send(`New review added to the book with the ISBN ${req.body.isbn} !`)
        }            
    }
    else{
        res.send("Unable to find the book!");
    }
});

// DELETE request: Delete a book review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const sessionUser = req.session.authorization.username;
    if (book){
        for (const [key, review] of Object.entries(book.reviews)) {
            if (review.user === sessionUser) {
                console.log("key is : ", key, "the review is : ", book.reviews[key])
                delete book.reviews[key]
                return res.send(`Review of the user ${sessionUser} of the book with the ISBN ${isbn} has been deleted successfully  !`)
            }
        }
    }else{
        res.send("Unable to find the book!");
    }
    res.send(`Friend with the email  ${email} deleted.`);
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
