const { Post, User } = require('../models');

class PostController {
    async index(request, reply) {
        const flash = request.session.flash || {};
        request.session.flash = {};
        const posts = await Post.findAll({
            include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']]
        });
        return reply.view('posts/index.njk', {
            title: 'Publicaciones',
            posts,
            flash,
            session: request.session
        });
    }

    async show(request, reply) {
        const { id } = request.params;
        const post = await Post.findByPk(id, {
            include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }]
        });

        if (!post) {
            request.session.flash = { error: 'Publicación no encontrada.' };
            return reply.redirect('/posts');
        }

        return reply.view('posts/show.njk', {
            title: post.title,
            post,
            session: request.session
        });
    }

    async create(request, reply) {
        const flash = request.session.flash || {};
        request.session.flash = {};
        return reply.view('posts/create.njk', {
            title: 'Nueva Publicación',
            flash,
            session: request.session
        });
    }

    async store(request, reply) {
        try {
            const { title, content } = request.body;

            if (!title || !content) {
                request.session.flash = { error: 'El título y el contenido son obligatorios.' };
                return reply.redirect('/posts/create');
            }

            await Post.create({
                title,
                content,
                userId: request.session.userId
            });

            request.session.flash = { success: 'Publicación creada exitosamente.' };
            return reply.redirect('/posts');
        } catch (error) {
            request.session.flash = { error: 'Error al crear la publicación.' };
            return reply.redirect('/posts/create');
        }
    }

    async edit(request, reply) {
        const { id } = request.params;
        const flash = request.session.flash || {};
        request.session.flash = {};
        const post = await Post.findByPk(id);

        if (!post) {
            request.session.flash = { error: 'Publicación no encontrada.' };
            return reply.redirect('/posts');
        }

        if (post.userId !== request.session.userId && request.session.userRole !== 'admin') {
            request.session.flash = { error: 'No tienes permisos para editar esta publicación.' };
            return reply.redirect('/posts');
        }

        return reply.view('posts/edit.njk', {
            title: `Editar: ${post.title}`,
            post,
            flash,
            session: request.session
        });
    }

    async update(request, reply) {
        try {
            const { id } = request.params;
            const { title, content } = request.body;
            const post = await Post.findByPk(id);

            if (!post) {
                request.session.flash = { error: 'Publicación no encontrada.' };
                return reply.redirect('/posts');
            }

            if (post.userId !== request.session.userId && request.session.userRole !== 'admin') {
                request.session.flash = { error: 'No tienes permisos para editar esta publicación.' };
                return reply.redirect('/posts');
            }

            if (!title || !content) {
                request.session.flash = { error: 'El título y el contenido son obligatorios.' };
                return reply.redirect(`/posts/${id}/edit`);
            }

            await post.update({ title, content });
            request.session.flash = { success: 'Publicación actualizada exitosamente.' };
            return reply.redirect(`/posts/${id}`);
        } catch (error) {
            request.session.flash = { error: 'Error al actualizar la publicación.' };
            return reply.redirect('/posts');
        }
    }

    async destroy(request, reply) {
        try {
            const { id } = request.params;
            const post = await Post.findByPk(id);

            if (!post) {
                request.session.flash = { error: 'Publicación no encontrada.' };
                return reply.redirect('/posts');
            }

            await post.destroy();
            request.session.flash = { success: 'Publicación eliminada exitosamente.' };
            return reply.redirect('/posts');
        } catch (error) {
            request.session.flash = { error: 'Error al eliminar la publicación.' };
            return reply.redirect('/posts');
        }
    }
}

module.exports = new PostController();
