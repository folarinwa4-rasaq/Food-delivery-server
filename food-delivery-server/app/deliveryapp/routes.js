import { Router } from 'express';
import { home, product, adminStoreProduct, signin, signup, displayCart, verifyPayment, getProfile, pay, getallusers, addcart, getalladmins, delCart, displayOrders, authenticate, adminsignin, adminsignup, allOrders, updateState } from './controller.js'
import cors from 'cors'
import dotenv from 'dotenv';

export const routes = new Router();
dotenv.config();
routes.use(
    cors({
        credentials: true,
        origin: process.env.FRONT_URL,
    })
)


routes.get('/api/home', authenticate, home)
routes.post('/api/addcart', authenticate, addcart)
routes.get('/api/cart', authenticate, displayCart)
routes.get('/api/orders', authenticate, displayOrders)
routes.get('/api/allOrders', authenticate, allOrders)
routes.post('/api/updatestatus', authenticate, updateState)
routes.get('/api/getprofile', authenticate, getProfile)
routes.get('/api/allusers', getallusers)
routes.get('/api/alladmins', getalladmins)
routes.post('/api/adminsignin', adminsignin)
routes.post('/api/adminsignup', adminsignup)
routes.post('/api/signin', signin)
routes.post('/api/signup', signup)
routes.post('/api/addproducts', adminStoreProduct)
routes.post('/api/paye', authenticate, pay)
routes.post('/api/verifypay', authenticate, verifyPayment)
routes.get('/api/prod/:id', authenticate, product)