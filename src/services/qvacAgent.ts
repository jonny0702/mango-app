import mercadoData from "../data/mercado_local.json";
import type { Message } from "@/components/mango/ChatBubble";

// ============================================================================
// SIMULACIÓN DE @qvac/sdk (Motor de Inferencia Local)
// En producción dentro de Pear, esto importará y ejecutará el GGUF localmente.
// ============================================================================

/**
 * Función simulada del SDK de QVAC.
 * Recibe un prompt ya enriquecido (RAG) y devuelve la respuesta generada.
 */
async function localInferenceQVAC(prompt: string): Promise<string> {
  console.log("[QVAC SDK] Procesando inferencia local (offline) con prompt:\n", prompt);
  
  // Simulamos tiempo de inferencia local del modelo (ej: Llama3 8B GGUF)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Regex básico para simular la comprensión del modelo según nuestro contexto RAG.
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("papa")) {
    return JSON.stringify({
      text: "En tu zona el precio promedio de la papa está en $0.65/lb. La demanda es alta. Te sugiero publicar a $0.80/lb para maximizar tu margen.",
      offer: {
        product: "Papa",
        quantity: "50 Quintales",
        price: "$0.80 / lb"
      }
    });
  }
  
  if (lowerPrompt.includes("cebolla")) {
    return JSON.stringify({
      text: "El precio promedio de la cebolla es $0.85/lb y está en alza. Te sugiero un precio de $1.00/lb para tu oferta.",
      offer: {
        product: "Cebolla",
        quantity: "10 Quintales",
        price: "$1.00 / lb"
      }
    });
  }

  return JSON.stringify({
    text: "He revisado el mercado local. ¿Podrías especificar qué variedad y cantidad tienes disponible?",
  });
}

// ============================================================================
// LÓGICA DEL AGENTE
// ============================================================================

export async function processUserMessage(userText: string): Promise<Partial<Message>> {
  // 1. RAG (Recuperación): Extraemos el contexto de mercado local (JSON).
  // Aquí se podrían hacer búsquedas vectoriales locales (si hubiera DB vectorial) 
  // o simplemente inyectar la data relevante.
  const context = JSON.stringify(mercadoData.productos);

  // 2. Construcción del Prompt para el modelo
  const systemPrompt = `
Eres el Asistente de Campo de Mango App. Ayudas a productores agrícolas a fijar precios justos 
y publicar ofertas en el marketplace.
Utiliza esta base de datos local de precios para responder: ${context}
Debes responder SIEMPRE en formato JSON con la siguiente estructura:
{
  "text": "Tu mensaje para el productor",
  "offer": { "product": "Nombre", "quantity": "Cantidad sugerida", "price": "Precio sugerido" } // offer es opcional
}
  `.trim();

  const fullPrompt = `${systemPrompt}\n\nUser: ${userText}\nAssistant:`;

  // 3. Llamada al motor local (QVAC)
  try {
    const responseString = await localInferenceQVAC(fullPrompt);
    const parsedResponse = JSON.parse(responseString);
    
    return {
      content: parsedResponse.text,
      offer: parsedResponse.offer,
    };
  } catch (error) {
    console.error("Error en inferencia local:", error);
    return {
      content: "Lo siento, tuve un problema procesando tu consulta de forma local. Intenta de nuevo.",
    };
  }
}

