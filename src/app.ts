/// <reference path="./types/global.d.ts" />

import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import movieRoutes from "./routes/movies";

dotenv.config();

const app = express();
app.use(express.json());

// Einbinden der ausgelagerten Routen
app.use("/user", userRoutes);
app.use("/movies", movieRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
