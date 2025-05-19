import express from 'express';
import { routes } from './deliveryapp/routes.js'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();
dotenv.config();

await mongoose.connect('mongodb+srv://rasaqfolarinwa:HbuSk1dDmeUD0TQf@cluster0.dltq6mt.mongodb.net/')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
routes.use(
    cors({
        credentials: true,
        origin: process.env.FRONT_URL,
    })
)
app.use('/', routes);
export function start() {
    app.listen(8000, () => {
        console.log('hi!')
    });
};