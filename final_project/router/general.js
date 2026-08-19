const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        } else {
            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});


// Task 10
// Get the book list available in the shop using Axios + Promise
public_users.get('/', function (req, res) {
    axios.get('http://localhost:5000/')
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({
                error: "Unable to retrieve books"
            });
        });
});


// Task 11
// Get book details based on ISBN using Axios + async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            error: "Unable to retrieve book details"
        });
    }
});


// Task 12
// Get book details based on author using Axios + Promise
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    )
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({
                error: "Unable to retrieve books by author"
            });
        });
});


// Task 13
// Get book details based on title using Axios + async/await
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            error: "Unable to retrieve books by title"
        });
    }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const book = books[Number(isbn)];

    return res.status(200).json(book ? book.reviews : {});
});

module.exports.general = public_users;