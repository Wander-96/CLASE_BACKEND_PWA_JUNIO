import Workspace from "../models/workspace.model.js";

class WorkspaceRepository {
    /* --- 1. OBTENER ESPACIOS DE TRABAJO ACTIVOS --- */
    async getAll() {
        return await Workspace.find({ activo: true });
    }

    /* --- 2. OBTENER POR ID --- */
    async getById(workspace_id) {
        return await Workspace.findById(workspace_id);
    }

    /* --- 3. ELIMINADO LOGICO --- */
    async softDeleteById(workspace_id) {
        await this.updateById(workspace_id, { activo: false });
    }

    /* --- 4. ELIMINADO FISICO --- */
    async deleteById(workspace_id) {
        return await Workspace.findByIdAndDelete(workspace_id, { activo: false })
    }

    /* --- 5. ACTUALIZAR ESPACIO DE TRABAJO --- */
    async updateById(workspace_id, update_data) {
        return await Workspace.findByIdAndUpdate(workspace_id, update_data)
    }

    /* --- 6. CREAR ESPACIO DE TRABAJO --- */
    async create(nombre, descripcion) {
        return await Workspace.create({
            nombre,
            descripcion,
        });
    }
}

const workspaceRepository = new WorkspaceRepository();
export default workspaceRepository;