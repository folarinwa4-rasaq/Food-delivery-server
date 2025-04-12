import bcrypt from 'bcryptjs'

export const hash = async(password) => {
    const salt = 12;
    return await bcrypt.hash(password, salt);
}

export const compare = async(password, hash) => {
    return await bcrypt.compare(password, hash)
}