

import express from 'express'
import { PrismaClient} from '@prisma/client'
import bcrypt from 'bcrypt'
import passport from 'passport'
import flash from 'express-flash'
import session from 'express-session'

const app = express();
const prisma = new PrismaClient();

app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

import initializePassport from './passport-confiq.js'
initializePassport(
    passport, 
    email => user.find(user => user.email === email),
    id => user.find(user => user.id === id))

app.get('/', (req,res) => {
    res.render('index.ejs', {name: 'Tadas'})
})

app.route('/login')
    .get((req,res) => {
        res.render('login.ejs');
    })
    .post( passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

app.route('/signup')
    .get( (req,res) => {
        res.render('signup.ejs');
    })
    .post( async (req,res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = await prisma.user.create({
                data: {
                    userName: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                }
            })
            console.log(allUsers)
            console.log(user)
            res.redirect('/login');
            res.status(201).send();
        } catch {
            res.redirect('/signup');
            res.status(500).send();
        }
        
    })

app.listen(3000);

