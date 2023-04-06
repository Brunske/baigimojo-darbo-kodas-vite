import express from 'express'
import { PrismaClient} from '@prisma/client'

const app = express();
const prisma = new PrismaClient();

app.get('/', (req,res) => {
    console.log("here");
    res.send("Hi");
    // res.render("");
})

app.listen(3000);

