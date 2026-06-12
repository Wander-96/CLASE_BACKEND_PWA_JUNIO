import express from "express";
import cors from 'cors';
import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";

// Solo necesario si tienes problemas de DNS al conectar a MongoDB localmente
import dns from 'dns';
if (ENVIRONMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

// 1. Conectamos a la Base de Datos
connectMongoDB();

// 2. Iniciamos la aplicación Express (El Restaurante)
const app = express();
const PORT = ENVIRONMENT.PORT;

// 3. Configuraciones básicas
app.use(cors()); // Permite peticiones desde el frontend (CORS)
app.use(express.json()); // Permite que Express entienda el req.body en formato JSON

// 4. Contratamos al Mesero de Autenticación
// Toda ruta que empiece con '/api/auth' será manejada por authRouter
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter);

// 5. Encendemos el Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
