const uploadController = require('../controllers/uploadController');
const { requireLogin } = require('../middlewares/authMiddleware');

async function uploadRoutes(fastify) {
    fastify.get('/upload', { preHandler: [requireLogin] }, uploadController.showForm);
    fastify.post('/upload', { preHandler: [requireLogin] }, uploadController.handleUpload);
}

module.exports = uploadRoutes;
