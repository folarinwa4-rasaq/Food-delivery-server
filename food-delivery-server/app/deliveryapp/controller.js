import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { getAllProduct, getOneProduct, storeProduct, storeCart, getCart, GetProfile, existingCart, deleteCart, findUser, storeUser, storeOrders, updateStatus, findOrders, findOrder, getAllUsers, getAllAdmin, findAdmin, storeAdmin, storeProfile } from './model.js'
import { hash, compare } from './auth.js';
import Paystack from 'paystack-api';
import axios from 'axios'

dotenv.config();

export async function home(req, res) {
    const products = await getAllProduct();
    const Products = products.map(convetToObj)
    res.json(Products);
}

export async function product(req, res) {
    const id = req.params.id
    const product = await getOneProduct(id);
    const Products = convetToObj(product)
    res.json({ Products, user: req.user });
}

export async function addcart(req, res) {
    const user = req.user.name
    if (!user) {
        return res.json({ msg: 'please login to carry out this operation', value: false })
    }
    const { name, description, brand, price } = req.body
    if (!name & !description & !brand & !price) {
        return res.json({ msg: 'No data received', value: false })
    }
    const existing = await existingCart(user, name)
    console.log(existing)
    if (existing.length < 1) {
        await storeCart(user, name, description, brand, price)
        return res.json({ msg: 'Cart Stored Successfully', value: true })
    }
    return res.json({ msg: 'Cart added already', value: true })
}

export async function displayCart(req, res) {
    const name = req.user.name
    if (!name) {
        return res.json({ msg: 'Please Login To Get Your Credemtials', value: false })
    }
    const cart = await getCart(name)
    return res.json(cart)
}
export async function displayOrders(req, res) {
    const name = req.user.name
    if (!name) {
        return res.json({ msg: 'Please Login To Get Your Credemtials', value: false })
    }
    const orders = await findOrders(name)
    const Products = orders.map(convetToObject)
    return res.json(Products)
}

export async function allOrders(req, res) {
    const orders = await findOrder()
    const Products = orders.map(convetToObject)
    return res.json(Products)
}
export async function updateState(req, res) {
    const { id, newstatus } = req.body
    const orders = await updateStatus(id, newstatus)
    return res.json(orders)
}

export async function delCart(req, res) {
    const name = req.body
    if (name) {
        await deleteCart(req.user.name, name)
        req.json({ msg: 'Cart Deleted', value: true })
    } else {
        console.log('No Name.....')
    }
}

export async function getProfile(req, res) {
    const user = req.user.name
    const profile = await GetProfile(user)
    if (!profile) {
        res.json({ msg: 'Please setup your profile' })
    } else {
        res.json(profile)
    }
}

const paystackSecretKey = 'sk_test_f12f932e3366e980599cd2fee153085ccc1b2585'
const paystackInstance = new Paystack(paystackSecretKey)

export async function pay(req, res) {
    const { email, amount, callbackUrl, id, quantity } = req.body
    if (!email) {
        res.json({ msg: 'Please fill all fields', value: false })
    }
    const paymentResponse = await paystackInstance.transaction.initialize({ email, amount, callback_url: callbackUrl })
    res.json(paymentResponse)
}

export async function verifyPayment(req, res) {
    const { reference, id, quantity } = req.body;
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            "Content-Type": "application/json",
        },
    });

    if (response.data.data && response.data.data.status === "success") {
        const product = await getOneProduct(id);
        await storeOrders(req.user.name, product.name, quantity, product.description, product.brand, product.price, false, product.image)
        res.json({ msg: "Product Ordered Successfully", value: true });
    } else {
        res.json({ msg: "Payment Failed", value: false });
    }
}

export function adminStoreProduct(req, res) {
    const { name, brand, description, price, Image } = req.body;
    if (!name & !brand & !description & !price & !Image) {
        res.json({ msg: 'please provide complete credentials', value: false })
    }

    const image = Buffer.from(Image.split(',')[1], 'base64');
    storeProduct(name, description, brand, price, image);
    res.json({ msg: 'Product stored successfully', value: true })
}

export async function signup(req, res) {
    const data = req.body
    const user = await findUser(data.name)

    if (!data) {
        res.json({ msg: 'Please Provide Complete Credentials', value: false })
    }

    if (user) {
        res.json({ msg: 'Username Already Taken', value: false })
    }

    const passwordHash = await hash(data.password);
    await storeUser(data.name, data.email, passwordHash)
    console.log(data.firstname, data.lastname, data.phoneno, data.address, data.LGA, data.state)
    await storeProfile(data.name, data.email, data.firstname, data.lastname, data.phoneno, data.address, data.LGA, data.state)
    res.json({ msg: 'authentication successful', value: true })
}

export async function signin(req, res) {
    const data = req.body
    const user = await findUser(data.name)
    if (!user) {
        res.json({ msg: 'User Does Not Exist', value: false })
    }

    const comparePassword = await compare(data.password, user.password);
    if (!comparePassword) {
        res.json({ msg: 'Invalid Password', value: false })
    }

    const token = jwt.sign({ name: user.name, id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.cookie('token', token)
    res.json({ msg: 'authentication successful', value: true })
}

export async function adminsignup(req, res) {
    const { name, email, password } = req.body
    const user = await findAdmin(name)

    if (!name & !email & !password) {
        return res.json({ msg: 'Please Provide Complete Credentials', value: false })
    }
    if (user.length > 1) {
        return res.json({ msg: 'Username Already Taken', value: false })
    }

    const passwordHash = await hash(password);
    await storeAdmin(name, email, passwordHash)
    return res.json({ msg: 'authentication successful', value: true })
}

export async function adminsignin(req, res) {
    const { name, password } = req.body
    const user = await findAdmin(name)
    if (!user) {
        return res.json({ msg: 'User Does Not Exist', value: false })
    }
    const comparePassword = await compare(password, user.password);
    if (!comparePassword) {
        return res.json({ msg: 'Invalid Password', value: false })
    }
    return res.json({ msg: 'authentication successful', value: true })
}

export async function getallusers(req, res) {
    const users = await getAllUsers()
    res.json(users)
}

export async function getalladmins(req, res) {
    const users = await getAllAdmin()
    res.json(users)
}

const convetToObj = (p) => {
    const base64Img = p.image.toString('base64')
    return { name: p.name, brand: p.brand, description: p.description, price: p.price, image: base64Img, id: p._id }
}

const convetToObject = (p) => {
    const base64Img = p.image.toString('base64')
    return { user: p.user, name: p.name, quantity: p.quantity, brand: p.brand, description: p.description, price: p.price, status: p.status, image: base64Img, id: p._id }
}

export const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.send({ auth: false, message: 'please authenticate' })
    }
    try {
        const decoded = jwt.verify(token, 'folarinjusttestingjwt');
        req.user = decoded;
        next();
    } catch (error) {
        res.send({ auth: false, message: 'please authenticate' })
    }
}