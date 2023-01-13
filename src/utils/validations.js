function validarEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
function validarData(data) {
  const re = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  return re.test(data);
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
const nameValidator = (name) => {
  if (!name) {
    return {
      message: 'O campo "name" é obrigatório',
    };
  }
  if (name.length < 3) {
    return {
      message: 'O "name" deve ter pelo menos 3 caracteres',
    };
  }
  return {
    message: null,
  };
};
const ageValidator = ((age) => {
  if (!age) {
 return {
    message: 'O campo "age" é obrigatório',
  }; 
}
if (age < 18) {
 return {
  message: 'A pessoa palestrante deve ser maior de idade',
}; 
}
  return {
    message: null,
  };
});

const rateValidator = ((rate) => {
  if (rate === undefined) {
    return {
      message: 'O campo "rate" é obrigatório',
    }; 
  }
  if ((rate < 1 || rate > 5) || !Number.isInteger(rate)) {
    return {
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    }; 
  }
return {
  message: null,
    };
});

const watchedAtValidator = ((watchedAt) => {
  if (!watchedAt) {
 return {
  message: 'O campo "watchedAt" é obrigatório',
}; 
} const data = validarData(watchedAt);
if (!data) {
 return {
  message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
}; 
} return {
  message: null,
    };
});

const talkValidator = ((talk) => {
  if (!talk) {
 return {
    message: 'O campo "talk" é obrigatório',
  }; 
} 
const rate = rateValidator(talk.rate);
if (rate.message) return rate;
const watchedAt = watchedAtValidator(talk.watchedAt);
if (watchedAt.message) return watchedAt;
return { message: null };
});

const validationTalker = (bodyReq) => {
  const { name, age, talk } = bodyReq;
  const nome = nameValidator(name);
  if (nome.message) return nome;
  const idade = ageValidator(age);
  if (idade.message) return idade;
  const fala = talkValidator(talk);
  if (fala.message) return fala;
  return {
    message: null,
  };
};

module.exports = {
    validationData,
    validationTalker,
};