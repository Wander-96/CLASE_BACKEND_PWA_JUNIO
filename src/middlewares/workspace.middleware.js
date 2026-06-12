import ServerError from "../helpers/serverError.helper.js"
import workspaceRepository from "../repositories/workspace.repository.js"
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js"

function workspaceMiddleware(valid_roles = []) {
    5

    return async function (request, response, next) {
        try {
            const user_id = request.user.id
            const workspace_id = request.params.workspace_id

            if (!workspace_id) {
                throw new ServerError("No se proporciono el ID del espacio de trabajo", 400)
            }

            const workspace = await workspaceRepository.getById(workspace_id)
            if (!workspace) {
                throw new ServerError("No se encontro el espacio de trabajo", 404)
            }
            // Buscamos si existe la relación entre este usuario y este workspace
            const member_selected = await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id)
            if (!member_selected) {
                throw new ServerError("No eres miembro de este espacio de trabajo", 403)
            }
            // Verificamos si el rol del usuario esta dentro de la lista de roles permitidos.
            if (valid_roles.length > 0 && !valid_roles.includes(member_selected.rol)) {
                throw new ServerError("No tienes el rol necesario para esta accion", 403)
            }

            //Pegamos los datos en la "comanda" (resquest) para que el controlador los tenga a mano
            request.workspace = workspace
            request.membership = member_selected

            return next()

        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                return response.status(500).json({
                    message: "Error interno real",
                    ok: false,
                    status: 500
                });
            }
        }
    }
}

export default workspaceMiddleware;