const postController = require('../controllers/postController');
const { requireLogin } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

async function postRoutes(fastify) {
    fastify.get('/posts', postController.index);
    fastify.get('/posts/create', { preHandler: [requireLogin] }, postController.create);
    fastify.post('/posts', { preHandler: [requireLogin] }, postController.store);
    fastify.get('/posts/:id', postController.show);
    fastify.get('/posts/:id/edit', { preHandler: [requireLogin] }, postController.edit);
    fastify.post('/posts/:id', { preHandler: [requireLogin] }, postController.update);
    fastify.post('/posts/:id/delete', { preHandler: [requireRole('admin', 'editor')] }, postController.destroy);
}

module.exports = postRoutes;
