import express from 'express';
import cors from 'cors';
import { loadModel, completion } from '@qvac/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const MODEL_PATH = path.join(__dirname, 'models', 'Phi-3-mini-4k-instruct-q4.gguf');
let loadedModelId = null;

// Pre-cargamos el modelo al iniciar el servidor (opcional, pero recomendado)
console.log(`Cargando modelo local desde: ${MODEL_PATH}...`);

loadModel({ 
  modelSrc: MODEL_PATH, 
  modelType: 'llamacpp-completion' 
}).then(id => {
  loadedModelId = id;
  console.log(`¡Modelo cargado exitosamente! ID en memoria: ${loadedModelId}`);
}).catch(console.error);

app.post('/api/chat', async (req, res) => {
  const { mensajeUsuario, datosMercado } = req.body;

  if (!mensajeUsuario || !datosMercado) {
    return res.status(400).json({ error: "Faltan datos requeridos (mensajeUsuario, datosMercado)." });
  }

  // El SDK usa loadedModelId si existe, o ignora si falla. El try-catch abajo 
  // servirá de red de seguridad (fallback al MOCK).

  const systemPrompt = `Eres el asistente agrícola de Mango App. Ayudas a los productores a vender sus cosechas basándote EXCLUSIVAMENTE en estos precios del mercado local: ${datosMercado}. Si el usuario quiere vender, sugiere un precio y ayúdalo a estructurar su oferta.

DEBES responder SIEMPRE estrictamente con un JSON válido usando este formato (no añadas texto extra fuera del JSON):
{
  "text": "Tu respuesta amigable aquí",
  "offer": {
    "product": "Nombre del producto",
    "quantity": "Cantidad y unidad (ej: 50 Quintales)",
    "price": "Precio sugerido (ej: $0.80/lb)"
  }
}
Si no se requiere generar una oferta, omite el campo "offer" y devuelve solo "text".`;

  try {
    const response = await completion({
      modelId: loadedModelId || MODEL_PATH,
      history: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: mensajeUsuario }
      ],
      stream: false
    });
    
    res.json({ respuesta: await response.text });
  } catch (error) {
    console.error("Inferencia QVAC falló o modelo no disponible, usando simulador (MOCK):", error.message);
    
    // Si el usuario pregunta por "papa" o "cebolla", damos respuestas prearmadas
    const u = mensajeUsuario.toLowerCase();
    if (u.includes("papa")) {
      return res.json({ respuesta: JSON.stringify({
        text: "En tu zona el precio de la papa está en $0.65/lb. Sugiero publicar a $0.80/lb.", 
        offer: {product: "Papa", quantity: "50 Quintales", price: "$0.80/lb"}
      }) });
    } else if (u.includes("cebolla")) {
      return res.json({ respuesta: JSON.stringify({
        text: "El precio de la cebolla es $0.85/lb en alza. Sugiero publicar a $1.00/lb.", 
        offer: {product: "Cebolla", quantity: "10 Quintales", price: "$1.00/lb"}
      }) });
    }
    
    return res.json({ respuesta: JSON.stringify({
      text: "Recibido. ¿Qué cantidad tienes disponible para estructurar tu oferta?"
    }) });
  }
});

app.listen(PORT, () => {
  console.log(`Motor de IA local ejecutándose en http://localhost:${PORT}`);
});

