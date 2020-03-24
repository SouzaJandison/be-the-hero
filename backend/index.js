const express = require('express');

const app = express();

app.get('/', (request, response) => {
   return response.json({
       "Evento": "Semana OmniStack 11",
       "Aluno": "Jandison Barbosa"
   })
});

app.listen(3333);