const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// =====================================
// CHATBOT ASISTENTE
// =====================================
exports.chatBot = async (mensaje, historial = []) => {
    try {
        if (!process.env.GEMINI_API_KEY) throw new Error('API Key no configurada');
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const systemPrompt = `Eres un asistente virtual inteligente para el sistema de ventas y gestión "Loox Store". 
Eres educado, claro y conciso. Ayudas a los operadores y administradores a usar el sistema.
REGLA CRÍTICA: Debes responder basándote ÚNICAMENTE en los módulos reales del sistema. NO inventes funciones, menús o reportes que no existen. 
Los módulos reales del sistema son:
1. "Dashboard": Resumen principal de bienvenida.
2. "Usuarios": Para crear o gestionar accesos de administradores y vendedores.
3. "Pedidos": Muestra la lista de pedidos realizados, permite cambiar el estado del pedido (Registrado, Embalado, En camino, Pagado) y eliminar.
4. "Registrar Pedido": Formulario para ingresar datos del cliente, añadir productos con IA, elegir método de envío (SHALOM, OLVA) y registrar pagos o adelantos.
5. "Inteligencia": Pantalla de Analíticas avanzadas con IA. Aquí se encuentra la Predicción de Demanda, Segmentación de Clientes (K-Means), Clasificación de Riesgos y Rentabilidad por Tienda/Canal. ¡Este es el verdadero módulo de informes!
6. "Perfil": Para ver los datos de la cuenta actual.

Si el usuario pregunta cómo ver reportes o ventas, guíalo al módulo "Inteligencia". Si pregunta cómo vender, guíalo a "Registrar Pedido".`;
        
        const chat = model.startChat({
            history: historial.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.parts }]
            })),
            systemInstruction: { parts: [{ text: systemPrompt }] }
        });

        const result = await chat.sendMessage(mensaje);
        return result.response.text();
    } catch (error) {
        console.error('Error en Gemini Chat:', error);
        throw new Error('No se pudo comunicar con el asistente de IA.');
    }
};

// =====================================
// SUGERIR DESCRIPCIÓN Y PRECIO (PRODUCTOS)
// =====================================
exports.sugerirProducto = async (nombre) => {
    try {
        if (!process.env.GEMINI_API_KEY) throw new Error('API Key no configurada');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Actúa como un experto en marketing de ventas al por menor. 
Me han dado el nombre de este producto: "${nombre}".
Quiero que generes un objeto JSON con dos propiedades:
1. "descripcion": Una descripción atractiva para venderlo (máximo 3 líneas).
2. "precioSugerido": Un número entero estimado del valor de este producto en el mercado actual (moneda local).
Responde ÚNICAMENTE con el objeto JSON válido, sin formato markdown ni texto adicional.`;

        const result = await model.generateContent(prompt);
        let texto = result.response.text();
        
        // Limpiar backticks si el modelo los añade
        texto = texto.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(texto);
    } catch (error) {
        console.error('Error en Gemini Producto:', error);
        throw new Error('No se pudo generar la sugerencia del producto.');
    }
};

// =====================================
// ANÁLISIS GERENCIAL DE VENTAS
// =====================================
exports.analizarVentas = async (datosRentabilidad) => {
    try {
        if (!process.env.GEMINI_API_KEY) throw new Error('API Key no configurada');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Eres un consultor de negocios y análisis de datos. 
Analiza los siguientes datos de rentabilidad actual del negocio:
${JSON.stringify(datosRentabilidad, null, 2)}

Escribe un resumen gerencial (máximo 2 párrafos) destacando:
1. El canal de ventas más fuerte y recomendaciones para potenciar los débiles.
2. Un análisis sobre el crecimiento o caída frente al mes anterior.
No uses un lenguaje excesivamente técnico. Sé directo y útil.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error en Gemini Análisis:', error);
        throw new Error('No se pudo generar el análisis gerencial.');
    }
};
