const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        if (authenticatedUser(username, password)) {
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });

            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(300).json({ message: "Invalid username and password" });
        }
    }

    return res.status(300).json({ message: "Username and password is required!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.params.review;
    
    let book = books[Number(isbn)];
    
    const values = object.keys(book.review);
    book[values.length] = review;
    
    books[Number(isbn)] = book;
    
    return res.status(201).json({ message: "Review added!" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.params.review;
    
    let book = books[Number(isbn)];

    let index = -1;
    
    for(const [key, value] of Object.entries(book.reviews)){
        if(value === review){
            index = key;
        }
    }

    delete book.review[index];

    res.status(200).json({message: 'Review has been deleted sucessfully!'})

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
