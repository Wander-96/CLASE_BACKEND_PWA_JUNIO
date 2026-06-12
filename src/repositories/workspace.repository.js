import Workspace from "../models/workspace.model.js";

/* 
Crear el repository para manipular espacios de trabajo en la Base de Datos
*/

class WorkspaceRepository {
    // - getAll() Obtiene toda la lista de espacios de trabajo ACTIVOS.
    // (Recomendación: Usen find en vez de findOne, ya que quieren obtener una lista de resultados)

    async getAll() {
        return await Workspace.find({ activo: true });
    }
    // - getById(workspace_id) Obtener un espacio de trabajo por su id

    async getById(workspace_id) {
        return await Workspace.findById(workspace_id);
    }

    // - softDeleteById(workspace_id) Oculta el espacio sin borrarlo
    async softDeleteById(workspace_id) {
        await this.updateById(workspace_id, { activo: false });
    }

    // - deleteById(workspace_id) Eliminar un espacio de trabajo por su id y lo oculta en el retorno

    async deleteById(workspace_id) {
        return await Workspace.findByIdAndDelete(workspace_id, { activo: false })
    }

    // - updateById(workspace_id, update_data) Permite actualizar un espacio de trabajo por su ID   

    async updateById(workspace_id, update_data) {
        return await Workspace.findByIdAndUpdate(workspace_id, update_data)
    }

    // - create(nombre, descripcion) Permite crear un espacio de trabajo en la DB 

    async create(nombre, descripcion) {
        return await Workspace.create({
            nombre,
            descripcion,
        });
    }
}



// Aplicamos Singleton: exportamos la instancia, no la clase

const workspaceRepository = new WorkspaceRepository();
export default workspaceRepository;