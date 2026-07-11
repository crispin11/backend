const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Iniciando generación de PDF...');

// 1. Instalar pdfkit temporalmente si no está instalado
try {
  require.resolve('pdfkit');
  console.log('pdfkit ya está instalado.');
} catch (e) {
  console.log('Instalando pdfkit temporalmente...');
  execSync('npm install pdfkit --no-save', { stdio: 'inherit', cwd: __dirname });
}

const PDFDocument = require('pdfkit');
const doc = new PDFDocument({ margin: 50 });

const outputPath = path.join('c:', 'Users', 'antho', 'Downloads', 'Capstone Proyecto', 'sistemaweb', 'guion_exposicion.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// ==========================================
// DISEÑO DEL DOCUMENTO PDF
// ==========================================

// Título Principal
doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(24).text('GUION DE EXPOSICIÓN: FRONTEND SISWEB', { align: 'center' });
doc.moveDown(0.3);
doc.fillColor('#64748b').font('Helvetica-Oblique').fontSize(11).text('Presentación Profesional del Sistema de Gestión Comercial y Analítico con ML', { align: 'center' });
doc.moveDown(1.5);

// Línea divisoria
doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(562, doc.y).stroke();
doc.moveDown(1);

// Sección de Introducción
agregarSeccion('INTRODUCCIÓN Y BIENVENIDA (Tiempo sugerido: 2 min)', 
  `Voz del Expositor:\n` +
  `"Buenos días a todos los miembros del jurado y presentes. Hoy tengo el agrado de presentarles SISWEB, una plataforma web de gestión comercial inteligente diseñada específicamente para optimizar el control de ventas, la logística de pedidos y el análisis predictivo de nuestro negocio. En esta presentación nos enfocaremos en el Frontend de la aplicación, desarrollado sobre Angular, que ofrece una interfaz de usuario de nivel premium, intuitiva, altamente interactiva y adaptada a las necesidades reales del personal administrativo, vendedoras y gerencia."\n\n` +
  `Demostración Visual:\n` +
  `- Muestra la pantalla de inicio del sistema y destaca la tipografía Inter, la armonía de colores HSL y la fluidez general de la navegación.`
);

// Sección de Autenticación
agregarSeccion('1. AUTENTICACIÓN Y SEGURIDAD (Tiempo sugerido: 2 min)',
  `Voz del Expositor:\n` +
  `"El primer punto clave es la seguridad y el control de accesos. SISWEB cuenta con un sistema de autenticación centralizado. Al ingresar al sistema, las credenciales del usuario son validadas en el servidor y, en base a su perfil o rol —sea Administrador, Vendedor u Operario—, el sistema habilita o restringe dinámicamente las funcionalidades.\n\n` +
  `Por ejemplo, un Administrador tiene acceso completo al panel de Gestión de Usuarios y al de Inteligencia con Machine Learning, mientras que un Vendedor u Operario tiene bloqueadas estas áreas mediante guardianes de enrutamiento ('Role Guards') funcionales en Angular, garantizando que la información sensible y las configuraciones del sistema estén siempre protegidas en cumplimiento con la seguridad de accesos (RF 7.16)."\n\n` +
  `Demostración Visual:\n` +
  `- Inicia sesión con el usuario administrador (admin@gmail.com) y navega brevemente por el menú para mostrar todas las opciones habilitadas.`
);

// Sección del Dashboard
agregarSeccion('2. DASHBOARD DE MÉTRICAS EJECUTIVAS (Tiempo sugerido: 3 min)',
  `Voz del Expositor:\n` +
  `"Una vez dentro del sistema, el usuario es recibido por el Dashboard Analítico. Este panel de control en tiempo real proporciona un resumen financiero y operativo inmediato mediante tarjetas de KPIs: Ventas Totales, Montos Cobrados de Adelantos, Saldos Pendientes por Cobrar e Indicadores de Volumen.\n\n` +
  `Pero más allá de los números simples, implementamos un panel avanzado de KPIs con un Semáforo de Alertas Críticas (RF 7.25). Si la morosidad supera el 15%, o la tasa de conversión y adelantos caen del rango objetivo, el sistema levanta notificaciones visuales automáticas. Además, incluimos un Ranking de Rendimiento de Vendedoras (RF 7.20) que fomenta la productividad y, lo más importante, un exportador nativo que con un solo clic genera un Reporte Ejecutivo PDF limpio y vectorial para reuniones gerenciales."\n\n` +
  `Demostración Visual:\n` +
  `- Muestra las KPI cards, haz hincapié en el semáforo de alertas si hay desviaciones y presiona el botón 'Exportar Reporte PDF' para ver la vista previa de impresión limpia.`
);

// Sección de Pedidos
agregarSeccion('3. GESTIÓN OPERACIONAL DE PEDIDOS (Tiempo sugerido: 3 min)',
  `Voz del Expositor:\n` +
  `"El corazón operativo del sistema es el módulo de Pedidos. Diseñamos un flujo de pestañas (Tabs) que permite pasar rápidamente del listado general al formulario de creación. La tabla general (RF 7.3) muestra 11 columnas detallando fechas, vendedores, clientes, transportadoras, saldos y los días transcurridos calculados en tiempo real por el backend.\n\n` +
  `Al hacer clic en cualquier pedido, se despliega una Ficha Técnica Detallada (RF 7.6) que incluye la lista de productos y una Rueda Circular de Tracking Operativo (RF 7.13). Esta rueda, pintada mediante gradientes CSS dinámicos, muestra el porcentaje exacto de avance del pedido (desde Registrado hasta Entregado). Desde aquí, también se puede acceder a Modificar (Edición) o Eliminar el pedido de forma segura en cascada."\n\n` +
  `Demostración Visual:\n` +
  `- Abre un pedido mediante el icono del ojo, muestra cómo la rueda de progreso circular refleja el 80% si está 'En Camino' y explica la barra de estados.`
);

// Sección del Formulario
agregarSeccion('4. REGISTRO Y EDICIÓN DE PEDIDOS (Tiempo sugerido: 2 min)',
  `Voz del Expositor:\n` +
  `"El Formulario de Registro y Modificación (RF 7.1 y 7.2) es sumamente completo. Permite ingresar de forma ordenada los datos del cliente, dirección desagregada (Región, Provincia, Distrito, Dirección) y seleccionar la transportadora (Shalom, Olva, Shalom Hub) mediante botones de radio intuitivos.\n\n` +
  `El sistema recalcula dinámicamente los saldos y montos sobre la marcha. Además, solucionamos un bug común de memoria: al añadir productos al carrito de detalles, el sistema ejecuta una copia profunda de los campos, evitando que la edición de los inputs afecte los registros ya cargados. El mismo formulario funciona para crear nuevos pedidos o modificar los existentes mediante enrutamientos parametrizados con ID."\n\n` +
  `Demostración Visual:\n` +
  `- Ve a 'Crear Pedido', agrega un producto con precio y cantidad, y muestra cómo se actualiza automáticamente el 'Por Pagar' (saldo).`
);

// Sección de Inteligencia
agregarSeccion('5. INTELIGENCIA DE NEGOCIO Y MACHINE LEARNING (Tiempo sugerido: 3 min)',
  `Voz del Expositor:\n` +
  `"Finalmente, la corona analítica de SISWEB es el módulo de Inteligencia & ML. Aquí corremos algoritmos matemáticos avanzados de forma nativa en el frontend:\n\n` +
  `- Predicción de Demanda (RF 7.21): Mediante regresión lineal de mínimos cuadrados, estimamos las ventas del próximo mes con un cálculo del margen de error (MAPE), graficado en una curva SVG interactiva.\n` +
  `- Clasificación de Riesgo (RF 7.22): Un semáforo inteligente evalúa cada pedido categorizándolo en riesgo Alto, Medio o Bajo, sugiriendo medidas concretas de mitigación para proteger las finanzas.\n` +
  `- Segmentación de Clientes (RF 7.23): El algoritmo K-Means agrupa automáticamente a los compradores en VIP, Ocasionales o En Riesgo.\n` +
  `- Rentabilidad (RF 7.24): Compara detalladamente la rentabilidad entre Loox Store y Techbox, su crecimiento mensual y el costo de adquisición de clientes."\n\n` +
  `Demostración Visual:\n` +
  `- Navega a 'Inteligencia & ML', muestra el gráfico interactivo de proyección y explica las tarjetas de riesgo y segmentación K-Means.`
);

// Conclusión
doc.moveDown(1);
doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text('CONCLUSIÓN Y CIERRE (Tiempo sugerido: 1 min)');
doc.moveDown(0.3);
doc.fillColor('#334155').font('Helvetica').fontSize(10).text(
  `Voz del Expositor:\n` +
  `"Como han podido apreciar, SISWEB no es solo un registrador de pedidos; es una solución empresarial de 360 grados que empodera al equipo comercial y dota a la alta gerencia de analíticas avanzadas y proyecciones predictivas para la toma de decisiones informadas. La interfaz en Angular y el robusto backend transaccional en Node garantizan una velocidad y estabilidad de nivel superior. Muchas gracias por su atención, quedo abierto a su ronda de preguntas."`,
  { lineGap: 3 }
);

doc.end();

stream.on('finish', () => {
  console.log('PDF generado exitosamente en:', outputPath);
});

// Función para agregar secciones de manera consistente
function agregarSeccion(titulo, contenido) {
  // Evitar saltos de página huérfanos para los títulos
  if (doc.y > 600) {
    doc.addPage();
  }
  
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text(titulo);
  doc.moveDown(0.4);
  doc.fillColor('#334155').font('Helvetica').fontSize(10).text(contenido, { lineGap: 3, paragraphGap: 10 });
  doc.moveDown(1.2);
  
  // Línea divisoria suave
  doc.strokeColor('#f1f5f9').lineWidth(1).moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.8);
}
