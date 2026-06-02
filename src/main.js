import express from "express";
import cors from 'cors';
import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import dns from 'dns';

if (ENVIRONMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

connectMongoDB();

const app = express();
const PORT = ENVIRONMENT.PORT;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
