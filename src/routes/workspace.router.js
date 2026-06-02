import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import workspaceMiddleware from '../middlewares/workspace.middleware.js';
import workspaceController from '../controllers/workspace.controller.js';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles.constant.js';

const workspaceRouter = express.Router();

workspaceRouter.use(authMiddleware);

workspaceRouter.post('/', workspaceController.create);
workspaceRouter.get('/', workspaceController.getAllByUser);

workspaceRouter.delete(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.deleteById
)

workspaceRouter.put(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.updateById
)

export default workspaceRouter;