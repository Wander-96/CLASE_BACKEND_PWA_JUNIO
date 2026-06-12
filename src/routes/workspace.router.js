import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import workspaceMiddleware from '../middlewares/workspace.middleware.js';
import workspaceController from '../controllers/workspace.controller.js';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles.constant.js';
import memberWorkspaceController from '../controllers/memberWorkspace.controller.js';



const workspaceRouter = express.Router();

// =========================================================
// RUTAS LIBRES DE SEGURIDAD (Se abren desde el email)
// =========================================================
workspaceRouter.get(
    '/:workspace_id/members/:decision',
    memberWorkspaceController.processInvitation
);


// TRUCO 1: Aplicamos el Guardia de Autenticación a TODAS las rutas de este archivo
workspaceRouter.use(authMiddleware);
// =========================================================
// RUTAS BÁSICAS (Cualquier usuario logueado puede entrar)
// =========================================================
workspaceRouter.post('/', workspaceController.create);
workspaceRouter.get('/', workspaceController.getAllByUser);
// =========================================================
// RUTAS PROTEGIDAS (Solo miembros con roles específicos)
// =========================================================
// TRUCO 2: Fabricamos un guardia que SOLO deja pasar a dueños
workspaceRouter.delete(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.deleteById
)
// Fabricamos un guardia que deja pasar a dueños Y admins
workspaceRouter.put(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.updateById
)

// =========================================================
// RUTAS DE INVITACIONES
// =========================================================

// Ruta para ENVIAR una invitación (POST)
// Solo el OWNER y ADMIN del espacio pueden invitar a alguien
workspaceRouter.post(
    '/:workspace_id/members',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.OWNER]),
    memberWorkspaceController.inviteUser
);

// Ruta para ACEPTAR o RECHAZAR una invitación (GET)
// Esta ruta no lleva el middleware de roles porque la abre el invitado desde su email
// Usamos :decision como variable dinámica que será 'ACEPTADO' o 'RECHAZADO'
workspaceRouter.get(
    '/:workspace_id/members/:decision',
    memberWorkspaceController.processInvitation
);


export default workspaceRouter;