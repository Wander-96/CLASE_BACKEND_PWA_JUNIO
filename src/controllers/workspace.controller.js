import { request, response } from "express";
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js"
import ServerError from "../helpers/serverError.helper.js"
import workspaceRepository from "../repositories/workspace.repository.js";
import workspacerepository from "../repositories/workspace.repository.js"
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js"

class WorkspaceController {

    //1. CREAR UN ESPACIO DE TRABAJO

    async create(request, response) {
        try {
            const { nombre, descripcion } = request.body;

            //MIDDLEWARE: como el midd dejo pasar al usuario, dejo su ID en la request
            const user_id = request.user.id;

            //Validacion de negocio
            if (!nombre || nombre.trim() === '') {
                throw new ServerError("El nombre del espacio de trabajo es obligatorio", 400);
            }

            //1. Le pedimos al repositorio crear el espacio
            const newWorkspace = await workspaceRepository.create(
                nombre,
                descripcion || ""
            );

            //2. Le pedimos al repositorio de membresias que nos de la llave como dueños
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
    //2. OBTENER MIS ESPACIOS DE TRABAJO
    async getAllByUser(request, response) {
        try {
            const user_id = request.user.id;

            // Le pedimos al Repositorio que busque todas mis membresías
            // Gracias al '.populate()',esto no solo trae la membresía, sino todos los datos del Workspace
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

    //3. ELIMINAR ESPACIO DE TRAJO (ADMIN)
    async deleteById(request, response) {
        try {
            const workspace_id = request.params.workspace_id

            //soft delete (solo oculta)
            const deleted_workspace = await workspaceRepository.softDeleteById(workspace_id)

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

    // ACTUALIZAR ESPACIO DE TRABAJO 
    async updateById(request, response) {
        try {
            const workspace_id = request.params.workspace_id
            const { nombre, descripcion } = request.body

            //Objeto vacio donde guardamos solo lo que el usuario envio
            const updated_info = {}

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
            //Pasamos el objeto solo con los campos que se actualizaron
            await workspaceRepository.updateById(workspace_id, updated_info)
            const workspace_after_update = await workspaceRepository.getById(workspace_id)

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

