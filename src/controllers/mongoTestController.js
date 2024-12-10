const Victimas = require('../models/victimas');

async function testMongoQuery(req, res) {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Se requiere una consulta MongoDB' });
    }

    console.log("Consulta MongoDB recibida:", query);

    let result;
    if (Array.isArray(query)) {
      // Si es un array, asumimos que es una operación de agregación
      result = await Victimas.aggregate(query);
    } else {
      // Si no, asumimos que es una operación de búsqueda
      result = await Victimas.find(query);
    }

    Victimas.distinct('AFRODESCENDIENTE')
    .then(etapas => {
        console.log('AFRODESCENDIENTE existentes:');
        etapas.forEach(etapa => {
            console.log(etapa);
        });
    })
    .catch(error => {
        console.error('Error al buscar etapas:', error);
    });

    console.log(`Se encontraron ${result.length} resultados`);

    const formattedResult = formatResult(result);

    res.json(formattedResult);
  } catch (error) {
    console.error('Error al ejecutar la consulta de MongoDB:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}

function formatResult(result) {
  if (result.length === 0) {
    return { summary: "No se encontraron resultados para la consulta proporcionada.", details: [] };
  }

  let totalVictimas = 0;
  if (result[0].hasOwnProperty('TOTAL_VICTIMAS')) {
    totalVictimas = result.reduce((sum, doc) => sum + (doc.TOTAL_VICTIMAS || 0), 0);
  } else if (result[0].hasOwnProperty('total')) {
    totalVictimas = result[0].total;
  }

  const summary = `Se encontraron ${result.length} registros con un total de ${totalVictimas} víctimas.`;
  
  return {
    summary,
    details: result.slice(0, 10) // Limitamos a 10 resultados para no sobrecargar la respuesta
  };
}

module.exports = {
  testMongoQuery
};

