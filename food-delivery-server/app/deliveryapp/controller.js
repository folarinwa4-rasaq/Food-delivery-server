import jwt from 'jsonwebtoken'
import { getAllProduct, getOneProduct, storeProduct, getCart, findUser, storeUser, getAllUsers, getAllAdmin, findAdmin, storeAdmin } from './model.js'
import { hash, compare } from './auth.js';
import Paystack from 'paystack-api';

export async function home(req, res) {
    const products = await getAllProduct();
    const convertedProducts = products.map(convetToObj)
    res.json(convertedProducts);
}

export async function product(req, res) {
    const id = req.params.id
    const product = await getOneProduct(id);
    const convertedProducts = convetToObj(product)
    res.json(convertedProducts);
}

const paystackSecretKey = 'sk_test_f12f932e3366e980599cd2fee153085ccc1b2585'
const paystackInstance = new Paystack(paystackSecretKey)

export async function pay(req, res) {
    const { email, amount } = req.body
    console.log(paystackInstance)
    const paymentResponse = await paystackInstance.transaction.initialize({ email, amount, })
    console.log(paymentResponse)
    res.json(paymentResponse)
}

export function adminStoreProduct(req, res) {
    const { name, brand, description, price, Image } = req.body;
    console.log(description)
    if (!name & !brand & !description & !price & !Image) {
        res.json({ msg: 'please provide complete credentials', value: false })
    }

    const image = Buffer.from(Image.split(',')[1], 'base64');
    storeProduct(name, description, brand, price, image);
    res.json({ msg: 'Product stored successfully', value: true })
}

//remain to get name from cookie
export function displayCart(req, res) {
    const cart = getCart(name)
    res.json(cart)
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

    jwt.sign({ name: user.name, id: user._id }, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(user)
    })
    res.json({ msg: 'authentication successful', value: true })
}

export async function adminsignup(req, res) {
    const data = req.body
    const user = await findAdmin(data.name)

    if (!data) {
        res.json({ msg: 'Please Provide Complete Credentials', value: false })
    }

    if (user) {
        res.json({ msg: 'Username Already Taken', value: false })
    }

    const passwordHash = await hash(data.password);
    await storeAdmin(data.name, data.email, passwordHash)
    res.json({ msg: 'authentication successful', value: true })
}

export async function adminsignin(req, res) {
    const data = req.body
    const user = await findAdmin(data.name)
    if (!user) {
        res.json({ msg: 'User Does Not Exist', value: false })
    }

    const comparePassword = await compare(data.password, user.password);
    if (!comparePassword) {
        res.json({ msg: 'Invalid Password', value: false })
    }

    jwt.sign({ name: user.name, id: user._id }, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(user)
    })
    res.json({ msg: 'authentication successful', value: true })
}

const convetToObj = (p) => {
    const base64Img = p.image.toString('base64')
    return { name: p.name, brand: p.brand, description: p.description, price: p.price, image: base64Img, id: p._id }
}

export const getUser = (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err
            res.json(user)
        })
    } else {
        res.json({ msg: 'user not logged in', value: false })
    }
}