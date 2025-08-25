const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// #1
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books));
});

// #2
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// #3
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksArray = Object.values(books);

  const filteredBooks = booksArray.filter(
    (book) => book.author.toLowerCase() === author
  );

  if (filteredBooks.length > 0) {
    return res.json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// #4
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksArray = Object.values(books);

  const filteredBooks = booksArray.filter(
    (book) => book.title.toLowerCase() === title
  );

  if (filteredBooks.length > 0) {
    return res.json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

// #10
public_users.get("/internal-server", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// #11
// Get book details based on ISBN
public_users.get("/internal-server/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.json(response.data);
  } catch (err) {
    res.status(404).json({ message: "Book not found" });
  }
});

// #12
// Get book details based on author
public_users.get("/internal-server/author/:author", async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.json(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// #13
// Get all books based on title
public_users.get("/internal-server/title/:title", async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.json(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found for this title" });
  }
});



























// #5
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = book.reviews;

  if (Object.keys(reviews).length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  return res.json(reviews);
});

// #6
public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body.user;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res
      .status(400)
      .json({ message: "Username is invalid or already exists" });
  }

  users.push({ username: username.trim(), password });

  return res
    .status(200)
    .json({ message: `User ${username} registered successfully` });
});

module.exports.general = public_users;
