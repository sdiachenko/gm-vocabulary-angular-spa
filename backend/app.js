import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';

import wordGroupRoutes from './routes/wordGroup.routes.js';
import wordRoutes from './routes/word.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

mongoose
  .connect(
    "mongodb+srv://sdiachenko:<pswd>@gm.uxqceew.mongodb.net/gm-vocabulary"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/collections', wordGroupRoutes);

export default app;
