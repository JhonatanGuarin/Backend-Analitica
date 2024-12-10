const hf = require('../config/huggingface');
const { loadDataset, executeMongoQuery, generateAIResponse } = require('../services/queryService');
const Victimas = require('../models/victimas');

async function handleQuery(req, res) {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Se requiere una consulta' });
    }

    console.log("Consulta recibida:", query);

    const dataset = await loadDataset();
    const schemaFields = Object.keys(Victimas.schema.paths).join(', ');

    const prompt = `Basado en los siguientes ejemplos y el esquema de la base de datos, genera una consulta de MongoDB para la pregunta dada.

Esquema de la base de datos:
${schemaFields}

Ejemplos:
${dataset.map(example => `Pregunta: ${example.input}\nConsulta MongoDB: ${JSON.stringify(example.output)}`).join('\n\n')}

Ahora, genera una consulta MongoDB para esta pregunta: ${query}
La consulta debe ser un array de operaciones de agregación válido para MongoDB.
Usa EXACTAMENTE los nombres de campos proporcionados en el esquema.
Responde SOLO con la consulta en formato JSON, sin explicaciones adicionales.`;

    const response = await hf.textGeneration({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    console.log("Respuesta del modelo:", response.generated_text);

    let mongoQuery;
    try {
      const matches = response.generated_text.match(/\[.*?\]/s);
      if (matches) {
        mongoQuery = JSON.parse(matches[0]);
        console.log("Consulta MongoDB generada:", JSON.stringify(mongoQuery, null, 2));
      } else {
        throw new Error('No se encontró una consulta MongoDB válida en la respuesta');
      }
    } catch (error) {
      console.error('Error parseando la consulta MongoDB:', error);
      return res.status(500).json({ error: 'No se pudo generar una consulta válida' });
    }

    const results = await executeMongoQuery(mongoQuery);
    console.log("Resultados de la consulta:", JSON.stringify(results, null, 2));

    const aiResponse = await generateAIResponse(query, results);

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error en el controlador de IA:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}

module.exports = { handleQuery };

