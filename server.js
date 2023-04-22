// require('dotenv').config();

const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { access } = require("fs");
const { cookieJwtAuth } = require("./cookieJwtAuth");

const app = express();
const prisma = new PrismaClient();

//----------------------------END OF IMPORTS------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", //location of the react app were connected to
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(passport.initialize());
app.use(passport.session());

require("./passportConfig")(passport);

//----------------------------END OF MIDDLEWARE------------------------

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token === null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// }

// function generateAccessToken(user) {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
// }

//----------------------------END OF FUNCTIONS------------------------

app
  .route("/login")
  .get((req, res) => {
    const token = req.cookies.token;
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.send(req.user); //The req.user stores the entire user that has been authenticated inside of it
      console.log(req.cookies.token);
    } catch (err) {
      res.clearCookie("token");
      return res.status(260).send({ Message: "session has expired" });
    }
  })
  .post(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) {
        return res.status(210).send({ message: "Invalid credentials" });
      } else {
        req.login(user, (err) => {
          if (err) throw err;
          return res.status(200).send({
            message: "Login successful",
          });
        });
      }
    })(req, res, next);

    const username = req.body.username;

    const user = await prisma.user.findUnique({
      where: { userName: username },
    });
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      //secure: true,
      //maxAge: 100000,
      //signed: true,
    });
  });

//----------------------------END OF /LOGIN------------------------

// app.post("/token", async (req, res) => {
//   //TOKENS NEED TO BE STORED IN A DATABASE
//   const refreshToken = req.body.token;
//   if (refreshToken === null) return res.sendStatus(401);
//   if (!refreshToken.includes(refreshToken)) return res.sendStatus(403);
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     const accessToken = generateAccessToken({ accessToken: user.name });
//     res.json({ accessToken: accessToken });
//   });
// });

//----------------------------END OF /TOKEN------------------------

// app.delete("/logout", (req, res) => {
//   refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
//   res.sendStatus(204);
// });

//----------------------------END OF /LOGOUT------------------------

app
  .route("/signup")
  // .get((req, res) => {
  //   // res.render("signup.ejs");
  // })
  .post(async (req, res) => {
    const { username, email, password } = req.body;

    const emailSearch = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    const usernameSearch = await prisma.user.findFirst({
      where: {
        userName: username,
      },
    });
    //console.log(emailSearch);
    if (emailSearch != null && usernameSearch != null) {
      return res.status(250).send({ message: "Email and Username is in use" });
    } else if (emailSearch != null) {
      return res.status(251).send({ message: "Email already in use" });
    } else if (usernameSearch != null) {
      return res.status(252).send({ message: "Username is taken" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          userName: username,
          email: email,
          password: hashedPassword,
        },
      });
      console.log(user);
      return res.status(200).send({ message: "Signup successful" });
    } catch {
      return res.status(500).send({ message: "failure" });
    }
  });

//----------------------------END OF /SIGNUP------------------------

app.listen(5000, () => {
  console.log("server listening on port 5000");
});

//----------------------------END OF THE WORLD------------------------
