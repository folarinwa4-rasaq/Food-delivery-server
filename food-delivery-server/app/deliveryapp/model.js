import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    brand: String,
    price: Number,
    image: Buffer,
})

const orderSchema = new mongoose.Schema({
    user: String,
    name: String,
    quantity: Number,
    description: String,
    brand: String,
    price: Number,
    status: Boolean,
    image: Buffer,
})


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const profileSchema = new mongoose.Schema({
    name: String,
    email: String,
    first_name: String,
    last_name: String,
    phone_no: Number,
    address: String,
    LGA: String,
    state: String
})

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const cartSchema = new mongoose.Schema({
    user_name: String,
    product_name: String,
    product_description: String,
    product_brand: String,
    product_price: Number,
})


const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Cart = mongoose.model('Cart', cartSchema)
const Profile = mongoose.model('Profile', profileSchema)
const Order = mongoose.model('Order', orderSchema)

export async function getAllProduct() {
    return await Product.find()
}

export async function getOneProduct(id) {
    return await Product.findById(id)
}

export async function storeProduct(name, description, brand, price, image, address) {
    await Product.create({ name, description, brand, price, image, address })
}

export async function storeOrders(user, name, quantity, description, brand, price, status, image) {
    await Order.create({ user, name, quantity, description, brand, price, status, image })
}

export async function storeProfile(name, email, first_name, last_name, phone_no, address, LGA, state) {
    await Profile.create({ name, email, first_name, last_name, phone_no, address, LGA, state })
}

export async function storeCart(u_name, p_name, description, brand, price) {
    await Cart.create({ user_name: u_name, product_name: p_name, product_description: description, product_brand: brand, product_price: price })
}

export async function GetProfile(name) {
    return await Profile.findOne({ name: name })
}

export async function findOrders(name) {
    return await Order.find({ user: name })
}

export async function findOrder() {
    return await Order.find()
}

export async function updateStatus(id, status) {
    return await Order.findByIdAndUpdate(id, { status: status }, { new: true })
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

export async function getProfile(username) {
    return await Cart.find({ user_name: username })
}

export async function existingCart(username, name) {
    return await Cart.find({ user_name: username, product_name: name })
}
export async function deleteCart(username, name) {
    return await Cart.deleteOne({ user_name: username, product_name: name })
}

export async function deleteProduct(name) {
    return await Product.deleteOne({ name: name })
}