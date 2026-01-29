import connectDB from './db/index.js';
import { app } from './app.js';
import { env } from './config/env.js';

connectDB()
    .then(() => {
        const port = env.port;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    });