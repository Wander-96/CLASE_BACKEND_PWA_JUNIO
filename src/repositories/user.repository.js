import User from "../models/user.model.js";

class UserRepository {
    /* --- 1. OBTENER TODOS LOS USUARIOS ACTIVOS --- */
    async getAll() {
        return await User.find({ activo: true })
    }

    /* --- 2. OBTENER USUARIO POR ID --- */
    async getById(user_id) {
        return await User.findById(user_id)
    }

    /* --- 3. CREAR USUARIO --- */
    async create(nombre, email, password) {
        return await User.create({
            nombre,
            email,
            password
        })
    }

    /* --- 4. OBTENER USUARIO POR EMAIL --- */
    async getByEmail(email) {
        return await User.findOne({ email: email, activo: true })
    }

    /* --- 5. ELIMINAR USUARIO (SOFT DELETE) --- */
    async deleteById(user_id) {
        await User.findByIdAndUpdate(user_id, { activo: false })
    }

    /* --- 6. ACTUALIZAR USUARIO --- */
    async updateById(user_id, update_data) {
        await User.findByIdAndUpdate(user_id, update_data)
    }
}

const userRepository = new UserRepository()
export default userRepository