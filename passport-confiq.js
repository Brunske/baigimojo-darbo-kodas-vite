const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const prisma = new PrismaClient();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      prisma.user
        .findFirst({ where: { userName: username } })
        .then((user) => {
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        })
        .catch((err) => {
          throw err;
        });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    prisma.user
      .findFirst({ where: { id: id } })
      .then((user) => {
        cb(null, user);
      })
      .catch((err) => {
        throw err;
      });
  });
};
