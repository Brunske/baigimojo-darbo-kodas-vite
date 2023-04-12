const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

//----------------------------END OF IMPORTS------------------------

app.use(express.urlencoded({ extended: false }));
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
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(passport.initialize());
app.use(passport.session());

require("./passport-confiq")(passport);

//----------------------------END OF MIDDLEWARE------------------------

app
  .route("/login")
  .get((req, res) => {
    res.send(req.user);
  })
  .post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      console.log(user);
      if (err) throw err;
      if (!user) res.send("No User exists");
      else {
        req.login(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
          console.log(req.user);
        });
      }
    })(req, res, next);
  });
// .post(async (req, res) => {
//   const { username, password } = req.body;

//   // Check if the username exists in the database
//   const user = await prisma.user.findFirst({ where: { userName: username } });

//   console.log(user);

//   if (user === null) {
//     return res.status(400).json({ message: "User does not exist" });
//   }

//   // Check if the password is correct
//   const passwordMatch = await bcrypt.compare(password, user.password);
//   if (!passwordMatch) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   // If both checks pass, return a success message
//   return res.status(200).json({ message: "Login successful" });
// });

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

    if (emailSearch != null && usernameSearch != null) {
      return res.status(400).json({ message: "Email and Username is in use" });
    } else if (emailSearch != null) {
      return res.status(400).json({ message: "Email already in use" });
    } else if (usernameSearch != null) {
      return res.status(400).json({ message: "Username is taken" });
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
      return res.status(200).json({ message: "Signup successful" });
    } catch {
      return res.status(500).json({ message: "failure" });
    }
  });

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
