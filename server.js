import express from 'express';
import { APP_PORT, DB_URL } from './config';
const app = express();
import errorHandler from './middlewares/errorHandler';
import router from './routes';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

// Database connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});

global.appRoot = path.resolve(__dirname);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/api', router);
// Save media files here
app.use('/uploads', express.static('uploads'));

// Welcome page for api
app.use('/', (req, res) => {
    res.send(`
  <h1>Welcome to E-Commerce Rest APIs</h1>
  `);
});

// Middleware for error handling
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});