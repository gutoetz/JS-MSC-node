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
module.exports = {
    createToken,
    createUser,
};