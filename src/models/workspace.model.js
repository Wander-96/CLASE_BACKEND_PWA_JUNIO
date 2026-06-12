/* Generar el modelo de mongoose de workspace  */
import mongoose from 'mongoose'

/*
Aquí definimos el molde para un Espacio de Trabajo.
A diferencia del usuario, el Workspace es un objeto mucho más simple,
ya que la relación entre un usuario y un workspace (quién es dueño, quién es invitado)
se manejará en un tercer modelo para mantener la base de datos optimizada.
*/

const workspaceSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    fecha_creacion: {
        type: Date,
        required: true,
        default: Date.now() // Captura el instante en el que se crea el espacio
    },
    descripcion: {
        type: String,
        required: false // Es el único campo opcional (puede estar vacío)
    },
    estado: {
        type: Boolean,
        required: true,
        default: true // Útil para desactivar (borrar lógicamente) un espacio en lugar de eliminar los datos reales
    }
}

)

// Extraemos el nombre a una constante para exportarlo igual que hicimos con User
export const WORKSPACE_COLLECTION_NAME = "Workspace"

// Creamos y exportamos el Modelo
const Workspace = mongoose.model(WORKSPACE_COLLECTION_NAME, workspaceSchema);
export default Workspace
