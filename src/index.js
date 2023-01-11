const express = require('express');
const fs = require('fs');
const path = require('path');

const directory = path.join('src', 'talker.json');
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_STATUS = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_request, response) => {
  const data = await JSON.parse(fs.readFileSync(directory)) || [];
  response.status(HTTP_OK_STATUS).send(data);
}); 

app.get('/talker/:id', async (request, response) => {
  const data = await JSON.parse(fs.readFileSync(directory));
  const { id } = request.params;
  const filteredTalker = data.find((e) => e.id === +id);
  if (!filteredTalker) {
 response.status(HTTP_NOT_STATUS).send({
    message: 'Pessoa palestrante não encontrada',
  }); 
}
  response.status(HTTP_OK_STATUS).send(filteredTalker);
}); 

app.listen(PORT, () => {
  console.log('Online');
});
