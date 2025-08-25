const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (!username || username.trim().length < 3) return false;

  const exists = users.some((user) => user.username === username.trim());
  if (exists) return false;

  return true;
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// #7
//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body.user;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign(
    {
      data: username,
    },
    "access",
    { expiresIn: 60 * 60 }
  );
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "User successfully logged in" });
});

// #8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = jwt.decode(req.session.authorization.accessToken).data;

  const { review } = req.body;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review || review.trim().length === 0) {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  book.reviews[username] = review;

  //Write your code here
  return res.status(200).json({
    message: "Review added/updated successfully",
    review: book.reviews[username],
  });
});

// #9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = jwt.decode(req.session.authorization.accessToken).data;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;