import express from "express";
import Replicate from "replicate";
import cors from "cors";

const app = express();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

app.use(express.json());
app.use(cors()); // Añadir CORS para permitir peticiones desde el frontend

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const input = {
    top_k: 0,
    top_p: 0.95,
    prompt,
    max_tokens: 512,
    temperature: 0.7,
    system_prompt: "You are a helpful assistant",
    length_penalty: 1,
    max_new_tokens: 512,
    stop_sequences: "<|end_of_text|>,<|eot_id|>",
    prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    presence_penalty: 0,
    log_performance_metrics: false
  };
  
  let fullResponse = '';

  try {
    for await (const event of replicate.stream("meta/meta-llama-3-8b-instruct", { input })) {
      fullResponse += event.toString();
    }
    // Asegurarse de que la respuesta esté completa
    if (fullResponse.trim().endsWith('**F')) {
      fullResponse = fullResponse.slice(0, -3); // Remover el "**F" incompleto
    }
    
    res.json({ response: fullResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Ocurrió un error al procesar tu solicitud.',
      details: error.message 
    });
  }
});

app.listen(3500, () => {
  console.log("Server running on port 3500");
});