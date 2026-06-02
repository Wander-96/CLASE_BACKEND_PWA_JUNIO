import { request, response } from "express";
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js"
import ServerError from "../helpers/serverError.helper.js"
import workspaceRepository from "../repositories/workspace.repository.js";
import workspacerepository from "../repositories/workspace.repository.js"
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js"

class WorkspaceController {

    /* --- 1. CREAR UN ESPACIO DE TRABAJO --- */
    async create(request, response) {
        try {
            const { nombre, descripcion } = request.body;
            const user_id = request.user.id;

            if (!nombre || nombre.trim() === '') {
                throw new ServerError("El nombre del espacio de trabajo es obligatorio", 400);
            }

            const newWorkspace = await workspaceRepository.create(
                nombre,
                descripcion || ""
            );

            await workspaceMemberRepository.create(
                user_id,
                newWorkspace._id,
                MEMBER_WORKSPACE_ROLES.OWNER
            );

            return response.status(201).json({
                ok: true,
                message: "Espacio de trabajo creado con exito",
                data: {
                    workspace: newWorkspace
                }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    ok: false,
                    message: "Error interno del servidor"
                });
            }
        }
    }
    /* --- 2. OBTENER ESPACIOS DE TRABAJO DEL USUARIO --- */
    async getAllByUser(request, response) {
        try {
            const user_id = request.user.id;
            const workspaces = await workspaceMemberRepository.getByUserId(user_id);

            return response.status(200).json({
                ok: true,
                message: "Espacios de trabajo obtenidos",
                data: {
                    workspaces
                }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(500).json({ ok: false, message: "Error interno" });
            }
            console.error(error);
        }
    }

    /* --- 3. ELIMINAR ESPACIO DE TRABAJO --- */
    async deleteById(request, response) {
        try {
            const workspace_id = request.params.workspace_id;
            const deleted_workspace = await workspaceRepository.softDeleteById(workspace_id);

            return response.status(200).json({
                message: "Espacio de trabajo eliminado correctamente",
                ok: true,
                status: 200,
                data: {
                    workspace: deleted_workspace
                }
            });

        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                console.error("Error critico: ", error);
                return response.status(500).json({
                    message: "Error interno del servidor",
                    ok: false,
                    status: 500
                });
            }
        }
    }

    /* --- 4. ACTUALIZAR ESPACIO DE TRABAJO --- */
    async updateById(request, response) {
        try {
            const workspace_id = request.params.workspace_id;
            const { nombre, descripcion } = request.body;

            const updated_info = {};

            if (!nombre && !descripcion) {
                throw new ServerError("Debes enviar al menos un campo para actualizar", 400)
            }

            if (nombre) {
                if (nombre.length < 2) {
                    throw new ServerError("El nombre debe tener al menos 2 caracteres", 400)
                }
                updated_info.nombre = nombre
            }
            if (descripcion) {
                updated_info.descripcion = descripcion
            }
            await workspaceRepository.updateById(workspace_id, updated_info);
            const workspace_after_update = await workspaceRepository.getById(workspace_id);

            return response.status(200).json({
                message: "Espacio de trabajo actualizado exitosamente",
                ok: true,
                status: 200,
                data: {
                    workspace: workspace_after_update
                }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            } else {
                console.error('Error critico: ', error);
                return response.status(500).json({
                    message: "Error interno del servidor",
                    ok: false,
                    status: 500
                });
            }
        }
    }

}

const workspaceController = new WorkspaceController();
export default workspaceController;

