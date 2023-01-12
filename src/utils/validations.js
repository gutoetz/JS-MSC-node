function validarEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

const emailValidator = (bodyReq) => {
    const { email } = bodyReq;
    const formato = validarEmail(email);
    if (!email) {
        return {
            message: 'O campo "email" é obrigatório',
          };
    }
    if (!formato) {
        return {
            message: 'O "email" deve ter o formato "email@email.com"',
          };
    }
    return {
        message: null,
      };
};

const passwordValidator = (bodyReq) => {
    const { password } = bodyReq;
    if (!password) {
        return {
            message: 'O campo "password" é obrigatório',
          };
    }
    if (password.length < 6) {
        return {
            message: 'O "password" deve ter pelo menos 6 caracteres',
          };
    }
    return {
        message: null,
      };
};

const validationData = (bodyReq) => {
  const email = emailValidator(bodyReq);
  if (email.message) return email;
  const password = passwordValidator(bodyReq);
  if (password.message) return password;
  return {
    message: null,
  };
};

module.exports = {
    validationData,
};