// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import favoritesRoutes from './routes/favoritesRoutes.js';
import { client, httpRequestDurationMicroseconds } from './utils/metrics.js';

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Prometheus metrics middleware
app.use((req, res, next) => {
    const startHrTime = process.hrtime();

    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        httpRequestDurationMicroseconds
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .observe(elapsedMs);
    });

    next();
});

// Metrics endpoint
app.get('/api/favorites/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// API routes
app.use('/api/favorites', favoritesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Favorites service running on port ${PORT}`));
