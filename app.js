// app.js (with ES Module 'import' support)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

import formRoutes from './routes/forms.routes.js';
app.use(formRoutes);

// Start server
app.listen(PORT, () => {
  console.log(` Garuda Travels running at http://localhost:${PORT}`);
});
