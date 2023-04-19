const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { log } = require("console");
const { userInfo } = require("os");
const LocalStrategy = require("passport-local").Strategy;
const prisma = new PrismaClient();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await prisma.user
        .findFirst({ where: { userName: username } });
      if (user === null) return done(null, false);
      else {
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) return done(null, false);
        return done(null, user);
      }
    })
  );

  passport.serializeUser((user, done) => {
    // console.log((user.id))
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findFirst({ where: { id: id } });
    console.log(user);
    done(null, user);
  });

  // passport.deserializeUser(async (id, cb) => {
  //   await prisma.user
  //     .findFirst({ where: { id: id } })
  //     .then((user) => {
  //       //WRITE WHAT THE SERVER SENDS TO THE FRONTEND
  //       const userInformation = {
  //         username: user.userName,
  //       };
  //       console.log(userInformation)
  //       cb(err, userInformation);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // });

};
