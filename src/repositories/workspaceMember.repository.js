import WorkspaceMember from "../models/workspaceMembers.model.js"

class WorkspaceMemberRepository {

    /* --- 1. OBTENER MEMBRESÍA POR USUARIO Y WORKSPACE --- */
    async getByUserAndWorkspaceId(user_id, workspace_id) {
        const membership = await WorkspaceMember.findOne({
            fk_user_id: user_id,
            fk_workspace_id: workspace_id
        })
        return membership
    }

    /* --- 2. CREAR MEMBRESÍA --- */
    async create(user_id, workspace_id, rol) {
        return await WorkspaceMember.create({
            fk_workspace_id: workspace_id,
            fk_user_id: user_id,
            rol: rol,
        })
    }

    /* --- 3. OBTENER POR ID --- */
    async getById(member_id) {
        return await WorkspaceMember.findById(member_id)
    }

    /* --- 4. ACTUALIZAR POR ID --- */
    async updateById(member_id, update_data) {
        return await WorkspaceMember.findByIdAndUpdate(member_id, update_data)
    }

    /* --- 5. ELIMINAR POR ID --- */
    async deleteById(member_id) {
        return await WorkspaceMember.findByIdAndDelete(member_id)
    }

    /* --- 6. OBTENER MIEMBROS DE UN WORKSPACE (POPULATED) --- */
    async getByWorkspaceId(workspace_id) {
        const result = await WorkspaceMember
            .find({ fk_workspace_id: workspace_id })
            .populate('fk_user_id', 'nombre email') 

        const members_mapped = result.map(
            (member) => new MemberWorkspaceWithUserInfo(member)
        )
        return members_mapped
    }

    /* --- 7. OBTENER WORKSPACES DE UN USUARIO (POPULATED) --- */
    async getByUserId(user_id) {
        const memberships = await WorkspaceMember
            .find({ fk_user_id: user_id })
            .populate({
                path: 'fk_workspace_id',
                select: 'nombre descripcion estado',
                match: { estado: true }
            });

        return memberships
            .filter(membership => membership.fk_workspace_id)
            .map(membership => ({
                member_id: membership._id,
                member_rol: membership.rol,
                member_fecha_union: membership.fecha_creacion,
                workspace_id: membership.fk_workspace_id._id,
                workspace_nombre: membership.fk_workspace_id.nombre,
                workspace_descripcion: membership.fk_workspace_id.descripcion
            }))
    }
}

const workspaceMemberRepository = new WorkspaceMemberRepository()
export default workspaceMemberRepository

/* --- CLASE DTO: MIEMBRO CON USUARIO --- */
class MemberWorkspaceWithUserInfo {
    constructor(raw_member) {
        this.member_id = raw_member._id
        this.member_fk_workspace_id = raw_member.fk_workspace_id
        this.member_rol = raw_member.rol
        this.member_fecha_creacion = raw_member.fecha_creacion

        this.user_id = raw_member.fk_user_id._id
        this.user_nombre = raw_member.fk_user_id.nombre
        this.user_email = raw_member.fk_user_id.email
    }
}
