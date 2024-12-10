const mongoose = require('mongoose');

const victimasSchema = new mongoose.Schema({
    CRIMINALIDAD: { type: String, required: true },
    ES_ARCHIVO: { type: String, required: true },
    ES_PRECLUSION: { type: String, required: true },
    ESTADO: { type: String, required: true },
    ETAPA_CASO: { type: String, required: true },
    LEY: { type: String, required: true },
    PAÍS_HECHO: { type: String, required: true },
    DEPARTAMENTO_HECHO: { type: String, required: true },
    MUNICIPIO_HECHO: { type: String, required: true },
    SECCIONAL: { type: String, required: true },
    AÑO_HECHOS: { type: Number, required: true },
    AÑO_ENTRADA: { type: Number, required: true },
    AÑO_DENUNCIA: { type: Number, required: true },
    DELITO: { type: String, required: true },
    GRUPO_DELITO: { type: String, required: true },
    VICTIMA_CONSUMADO: { type: String, required: true },
    SEXO: { type: String, required: true },
    GRUPO_ETARIO: { type: String, required: true },
    PAÍS_NACIMIENTO: { type: String, required: true },
    APLICA_LGBTI: { type: String, required: true },
    APLICA_NNA: { type: String, required: true },
    INDÍGENA: { type: String, required: true },
    AFRODESCENDIENTE: { type: String, required: true },
    TOTAL_VÍCTIMAS: { type: Number, required: true },
});

module.exports = mongoose.model('victimas', victimasSchema);
