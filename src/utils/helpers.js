const createToken = (size) => {
    let token = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < size; i += 1) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

module.exports = {
    createToken,
};