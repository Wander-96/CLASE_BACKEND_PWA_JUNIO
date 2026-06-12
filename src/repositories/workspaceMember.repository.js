import WorkspaceMember from "../models/workspaceMembers.model.js"

class WorkspaceMemberRepository {

    // Busca una membresía específica cruzando el ID del usuario y el ID del workspace
    async getByUserAndWorkspaceId(user_id, workspace_id) {
        const membership = await WorkspaceMember.findOne({
            fk_user_id: user_id,
            fk_workspace_id: workspace_id
        })
        return membership
    }

    async create(user_id, workspace_id, rol) {
        return await WorkspaceMember.create({
            fk_workspace_id: workspace_id,
            fk_user_id: user_id,
            rol: rol,
        })
    }

    async getById(member_id) {
        return await WorkspaceMember.findById(member_id)
    }

    async updateById(member_id, update_data) {
        return await WorkspaceMember.findByIdAndUpdate(member_id, update_data)
    }

    async deleteById(member_id) {
        return await WorkspaceMember.findByIdAndDelete(member_id)
    }

    /* --- 2. TRAER MIEMBROS DE UN WORKSPACE --- */
    async getByWorkspaceId(workspace_id) {
        const result = await WorkspaceMember
            .find({ fk_workspace_id: workspace_id })
            // Aquí rellenamos los datos del usuario (corregido a fk_user_id)
            .populate('fk_user_id', 'nombre email') //POPULATE:
        // En lugar de devolvernos solo el ID del usuario('fk_user_id'), le decimos 
        // a Mongoose: "Ve a la colección de Usuarios, busca este ID y tráeme 
        // directamente su 'nombre' y 'email'"

        // Usamos la clase ayudante para limpiar cada resultado de la lista
        const members_mapped = result.map(
            (member) => new MemberWorkspaceWithUserInfo(member)
        )
        return members_mapped
    }

    /* --- 3. TRAER WORKSPACES DE UN USUARIO --- */
    async getByUserId(user_id) {
        const memberships = await WorkspaceMember
            .find({ fk_user_id: user_id })
            // Aquí rellenamos los datos del Workspace
            .populate({
                path: 'fk_workspace_id',
                select: 'nombre descripcion estado',
                match: { estado: true }
            });

        return memberships
            // Filtramos los nulos (por si el workspace fue borrado)
            .filter(membership => membership.fk_workspace_id)
            // Transformamos (limpiamos) la data con una Arrow Function
            .map(membership => ({
                member_id: membership._id,
                member_rol: membership.rol,
                member_fecha_union: membership.fecha_creacion, // Corregido de fecha.creacion a fecha_creacion
                workspace_id: membership.fk_workspace_id._id,
                workspace_nombre: membership.fk_workspace_id.nombre,
                workspace_descripcion: membership.fk_workspace_id.descripcion
            }))
    }
}

const workspaceMemberRepository = new WorkspaceMemberRepository()
export default workspaceMemberRepository


/* CLASE AYUDANTE (Helper) */
class MemberWorkspaceWithUserInfo {
    constructor(raw_member) {
        this.member_id = raw_member._id
        this.member_fk_workspace_id = raw_member.fk_workspace_id
        this.member_rol = raw_member.rol
        this.member_fecha_creacion = raw_member.fecha_creacion

        // Gracias al populate, podemos acceder a las propiedades del usuario
        this.user_id = raw_member.fk_user_id._id
        this.user_nombre = raw_member.fk_user_id.nombre
        this.user_email = raw_member.fk_user_id.email
    }
}
