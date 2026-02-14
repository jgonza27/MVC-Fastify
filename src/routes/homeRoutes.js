const homeController = require('../controllers/homeController');

async function homeRoutes(fastify) {
    fastify.get('/', homeController.index);
    fastify.get('/about', homeController.about);
    fastify.get('/greet/:name', homeController.greet);
    fastify.get('/cookies', homeController.cookiesPage);
    fastify.post('/cookies', homeController.setCookies);
    fastify.get('/error-test', homeController.throwError);
}

module.exports = homeRoutes;
