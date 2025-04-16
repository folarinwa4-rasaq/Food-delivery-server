import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    brand: String,
    price: Number,
    image: Buffer,
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone_no: Number,
})

const cartSchema = new mongoose.Schema({
    product_name: String,
    user_name: String,
    product_description: String,
    product_brand: String,
    product_price: Number,
})


const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Cart = mongoose.model('Cart', cartSchema)

export async function getAllProduct() {
    return await Product.find()
}

export async function getOneProduct(id) {
    return await Product.findById(id)
}

export async function storeProduct(name, description, brand, price, image, address) {
    await Product.create({ name, description, brand, price, image, address })
}

export async function findUser(name) {
    return await User.findOne({ name })
}

export async function storeUser(name, email, password, phone_no) {
    await User.create({ name, email, password, phone_no })
}

export async function findAdmin(name) {
    return await Admin.find({ name: name })
}

export async function storeAdmin(name, email, password, phone_no) {
    return await Admin.create({ name, email, password, phone_no })
}

export async function getAllUsers() {
    return await User.find()
}

export async function getAllAdmin() {
    return await Admin.find()
}

export async function getCart(username) {
    return await Cart.find({ user_name: username })
}