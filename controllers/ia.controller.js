const iaService = require('../services/ia.service');

exports.chat = async (req, res) => {
    try {
        const { mensaje, historial } = req.body;
        if (!mensaje) return res.status(400).json({ error: 'Mensaje requerido' });

        const respuesta = await iaService.chatBot(mensaje, historial || []);
        res.json({ respuesta });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sugerirProducto = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ error: 'Nombre de producto requerido' });

        const sugerencia = await iaService.sugerirProducto(nombre);
        res.json(sugerencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.analizarVentas = async (req, res) => {
    try {
        const { datos } = req.body;
        if (!datos) return res.status(400).json({ error: 'Datos de ventas requeridos' });

        const analisis = await iaService.analizarVentas(datos);
        res.json({ analisis });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
