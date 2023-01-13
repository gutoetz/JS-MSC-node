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
const HTTP_DELETE_STATUS = 204;
const HTTP_NOT_STATUS = 404;
const HTTP_ERROR_STATUS = 400;
const PORT = '3000';

const isAutorized = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ message: 'Token não encontrado' });
  }
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
  if (validatedData.message) { 
    return response.status(HTTP_ERROR_STATUS).send(validatedData); 
}
  return response.status(HTTP_OK_STATUS).send({ token });
}); 

app.post('/talker', isAutorized, async (request, response) => {
  const { body } = request;
  const data = await JSON.parse(fs.readFileSync(directory));
  const validateTalker = await validation.validationTalker(body);
  if (validateTalker.message) {
    return response.status(HTTP_ERROR_STATUS).send(validateTalker); 
  }
  const newData = await helpers.createUser(data, body);
  await fs.writeFileSync(directory, JSON.stringify([...data, newData]));
  response.status(HTTP_CREATE_STATUS).send(newData); 
});

app.put('/talker/:id', isAutorized, async (request, response) => {
  const { body, params } = request;
  const data = await JSON.parse(fs.readFileSync(directory));

  const validateTalker = await validation.validationTalker(body);
  if (validateTalker.message) {
    return response.status(HTTP_ERROR_STATUS).send(validateTalker); 
  }
  const modifiedData = await helpers.modifyUser(data, body, params);
  data.filter((e) => e.id !== Number(body.id));
  await fs.writeFileSync(directory, JSON.stringify([...data, modifiedData]));
  response.status(HTTP_OK_STATUS).send(modifiedData); 
});

app.delete('/talker/:id', isAutorized, async (request, response) => {
  const { params: { id } } = request;
  const data = await JSON.parse(fs.readFileSync(directory));
  const newData = await data.filter((e) => e.id !== Number(id));
  await fs.writeFileSync(directory, JSON.stringify([...newData]));
  response.status(HTTP_DELETE_STATUS).send(); 
});

// app.delete('/talker/:id', isAutorized, async (request, response) => {
//   const { params: { id } } = request;
//   const data = await JSON.parse(fs.readFileSync(directory));
//   const newData = await data.filter((e) => e.id !== Number(id));
//   await fs.writeFileSync(directory, JSON.stringify([...newData]));
//   response.status(HTTP_DELETE_STATUS).send(); 
// });

app.listen(PORT, () => {
  console.log('Online');
});
