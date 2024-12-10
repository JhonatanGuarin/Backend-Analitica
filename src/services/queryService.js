const fs = require('fs').promises;
const path = require('path');
const Victimas = require('../models/victimas');
const hf = require('../config/huggingface');

async function loadDataset() {
  try {
    const datasetPath = path.join(process.cwd(), 'dataset.json');
    const rawData = await fs.readFile(datasetPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error cargando el dataset:', error);
    return [];
  }
}

async function executeMongoQuery(query) {
  try {
    console.log("Ejecutando consulta MongoDB:", JSON.stringify(query, null, 2));
    if (Array.isArray(query)) {
      return await Victimas.aggregate(query);
    } else {
      return await Victimas.find(query);
    }
  } catch (error) {
    console.error('Error ejecutando consulta MongoDB:', error);
    throw error;
  }
}

async function generateAIResponse(originalQuery, results) {
  const prompt = `
Basándote en la siguiente pregunta y los resultados obtenidos, genera una respuesta clara y concisa en español.

Pregunta: "${originalQuery}"

Resultados: ${JSON.stringify(results, null, 2)}

Genera una respuesta que:
1. Responda directamente a la pregunta.
2. Incluya los datos relevantes de los resultados.
3. Sea fácil de entender para un usuario no técnico.
4. Use un tono amable y profesional.
5. No exceda de 3 oraciones.

Respuesta:`;

  try {
    const response = await hf.textGeneration({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    // Extraer solo la respuesta generada, eliminando el prompt
    const generatedResponse = response.generated_text.split('Respuesta:')[1].trim();
    return generatedResponse;
  } catch (error) {
    console.error('Error generando respuesta de IA:', error);
    return "Lo siento, no pude generar una respuesta personalizada. Por favor, revisa los resultados proporcionados.";
  }
}

module.exports = {
  loadDataset,
  executeMongoQuery,
  generateAIResponse
};


