const express = require('express');
const fs = require('fs');
const path = require('path');
const helpers = require('./utils/helpers');
const validation = require('./utils/validations');

const directory = path.join('src', 'talker.json');
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATE_STATUS = 201;
const HTTP_NOT_STATUS = 404;
const HTTP_ERROR_STATUS = 400;
const PORT = '3000';

const isAutorized = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ message: 'Token não encontrado' });
  }
  console.log(authorization);
  if (authorization.length !== 16 || typeof (authorization) !== 'string') { 
    return res.status(401).send({ message: 'Token inválido' });
   }
   next();
};

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

app.post('/login', async (request, response) => {
  const bodyReq = request.body;
  const validatedData = validation.validationData(bodyReq);
  const token = helpers.createToken(16);
  console.log(validatedData);
  if (validatedData.message) { 
    return response.status(HTTP_ERROR_STATUS).send(validatedData); 
}
  return response.status(HTTP_OK_STATUS).send({ token });
}); 

app.post('/talker', isAutorized, async (request, response) => {
  const { body } = request;
  const data = await JSON.parse(fs.readFileSync(directory));
  const validateTalker = await validation.validationTalker(body);
  console.log(validateTalker);
  if (validateTalker.message) {
    return response.status(HTTP_ERROR_STATUS).send(validateTalker); 
  }
  const newData = await helpers.createUser(data, body);
  await fs.writeFileSync(directory, JSON.stringify([...data, newData]));
  response.status(HTTP_CREATE_STATUS).send(newData); 
});

app.listen(PORT, () => {
  console.log('Online');
});
