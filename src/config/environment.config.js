import dotenv from 'dotenv'

/* 
dotenv.config() lee el archivo .env que acabamos de crear y carga 
todas esas variables directamente en la memoria del sistema (process.env).
*/
dotenv.config()

/* 
Guardamos todas las variables en un solo objeto constante. 
¿Por qué? Porque si mañana cambias el nombre de una variable en el .env, 
solo necesitas venir a actualizarlo en este archivo y no en 10 archivos distintos.
*/
const ENVIRONMENT = {
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MODE: process.env.MODE,
    PORT: process.env.PORT,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    URL_BACKEND: process.env.URL_BACKEND,
    JWT_SECRET: process.env.JWT_SECRET
}

// Lo exportamos para usarlo en cualquier lugar del proyecto
export default ENVIRONMENT;
