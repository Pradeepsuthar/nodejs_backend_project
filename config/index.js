import dotenv from 'dotenv';

dotenv.config();

export const {
    APP_PORT,
    DB_URL,
    DEBUG_MODE,
    REFRESH_SECRET,
    JWT_SECRET,
    APP_URL
} = process.env