require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());

// =========================
// RUTAS
// =========================
const pedidosRoutes = require("./routes/pedidos.routes");
app.use("/pedidos", pedidosRoutes);

const usuariosRoutes = require("./routes/usuarios.routes");
app.use("/usuarios", usuariosRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const productosRoutes = require("./routes/productos.routes");
app.use("/productos", productosRoutes);

const iaRoutes = require("./routes/ia.routes");
app.use("/ia", iaRoutes);

// Ruta de diagnóstico simple
app.get("/", (req, res) => {
  res.json({ mensaje: "API de sistemaweb activa y funcionando correctamente" });
});

// =========================
// INICIAR SERVIDOR
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
