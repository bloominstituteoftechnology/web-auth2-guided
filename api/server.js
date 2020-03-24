const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const restricted = require("../auth/restricted-middleware");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRouter);
server.use("/api/users", restricted, checkRole("user"), usersRouter);
//"restricted" guarantees that the user is logged in before you hit the usersRouter

server.get("/", (req, res) => {
  res.send("It's alive!");
});

module.exports = server;

function checkRole(role) {
  return (req, res, next) => {
    if (
      req.decodedToken &&
      req.decodedToken.role &&
      req.decodedToken.role.toLowerCase() === role //compares to the role you are looking for in line 16 ('user'); example: this could be like 'hr', only 'hr' can see certain pages
    ) {
      next();
    } else {
      res.status(403).json({ you: "shall not pass" });
    }
  };
}
