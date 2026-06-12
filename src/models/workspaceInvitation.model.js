import mongoose from "mongoose";
import { WORKSPACE_COLLECTION_NAME } from "./workspace.model.js";
import { USER_COLLECTION_NAME } from "./user.model.js";
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js";
import MEMBER_INVITATION_STATUS from "../constants/memberInvitationStatus.constant.js";

const workspaceInvitationSchema = new mongoose.Schema({
    //Espacio de invitacion
    fk_workspace_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: WORKSPACE_COLLECTION_NAME
    },

    //Quien invita
    fk_invited_by_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: USER_COLLECTION_NAME
    },

    //Email al que enviamos la invitacion
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    //Rol que tendra el usuario si acepta la invitacion
    rol: {
        enum: [MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.USER],
        type: String,
        default: MEMBER_WORKSPACE_ROLES.USER
    },

    //Estado actual
    status: {
        enum: [MEMBER_INVITATION_STATUS.PENDING, MEMBER_INVITATION_STATUS.ACCEPTED,
        MEMBER_INVITATION_STATUS.REJECTED],
        type: String,
        default: MEMBER_INVITATION_STATUS.PENDING
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_expiracion: {
        type: Date,
        required: true
    }
})

export const WORKSPACE_INVITATION_MODEL_NAME = 'WorkspaceInvitation'
const WorkspaceInvitation = mongoose.model(WORKSPACE_INVITATION_MODEL_NAME, workspaceInvitationSchema)

export default WorkspaceInvitation;