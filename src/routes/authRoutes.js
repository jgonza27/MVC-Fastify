const authController = require('../controllers/authController');

async function authRoutes(fastify) {
    fastify.get('/register', authController.showRegister);
    fastify.post('/register', authController.register);
    fastify.get('/login', authController.showLogin);
    fastify.post('/login', authController.login);
    fastify.get('/logout', authController.logout);
}

module.exports = authRoutes;
