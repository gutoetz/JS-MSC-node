const createToken = (size) => {
    let token = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < size; i += 1) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};
const createUser = (data, user) => {
    const id = data.length + 1;
    const newUser = {
        name: user.name,
        age: user.age,
        id,
        talk: {
            rate: user.talk.rate,
          watchedAt: user.talk.watchedAt,
        },
    };
    return newUser;
};

const modifyUser = (data, body, params) => {
    const { id } = params;
    const newUser = data.filter((e) => e.id === Number(id))[0];
    const { name, age, talk } = body;
    newUser.name = name;
    newUser.age = age;
    newUser.talk = talk;
    return newUser;
};

module.exports = {
    createToken,
    createUser,
    modifyUser,
};