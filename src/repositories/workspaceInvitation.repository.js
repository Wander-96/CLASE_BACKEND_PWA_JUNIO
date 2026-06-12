import WorkspaceInvitation from "../models/workspaceInvitation.model.js";

class WorkspaceInvitationRepository {

    //CREAR INVITACIÓN
    async create(workspace_id, invited_by_id, email, rol, expiration_date) {
        return await WorkspaceInvitation.create({
            fk_workspace_id: workspace_id,
            fk_invited_by_id: invited_by_id,
            email: email,
            rol: rol,
            fecha_expiracion: expiration_date
        })
    }

    //OBTENER POR ID
    async getById(invitation_id) {
        return await WorkspaceInvitation.findById(invitation_id)
    }

    //OBTENER INVITACIÓN POR WORKSPACE Y EMAIL
    async getByWorkspaceAndEmail(workspace_id, email) {
        return await WorkspaceInvitation.findOne({
            fk_workspace_id: workspace_id,
            email: email
        })
    }

    //ACTUALIZAR ESTADO
    async updateById(invitation_id, update_data) {
        return await WorkspaceInvitation.findByIdAndUpdate(invitation_id, update_data, { new: true })
    }

    //ELIMINAR INVITACIÓN 
    async deleteById(invitation_id) {
        return await WorkspaceInvitation.findByIdAndDelete(invitation_id)
    }
}

const workspaceInvitationRepository = new WorkspaceInvitationRepository();
export default workspaceInvitationRepository;
