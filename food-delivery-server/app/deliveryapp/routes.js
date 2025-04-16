import { Router } from 'express';
import { home, product, adminStoreProduct, signin, signup, getUser, pay } from './controller.js'
import cors from 'cors'

export const routes = new Router();

routes.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
    })
)

routes.get('/api/home', home) //authuser
routes.post('/api/addproducts', adminStoreProduct)
routes.post('/api/signin', signin)
routes.post('/api/signup', signup)
routes.get('/authuser', getUser)
routes.post('/api/paye', pay)
routes.get('/api/prod/:id', product)