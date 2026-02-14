const path = require('path');
const fastify = require('fastify')({ logger: true });

const { sequelize } = require('./models');

async function build() {
    await fastify.register(require('@fastify/cookie'));

    await fastify.register(require('@fastify/session'), {
        secret: 'una-clave-secreta-muy-larga-y-segura-para-la-sesion-mvc-fastify-2024',
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        },
        saveUninitialized: false
    });

    await fastify.register(require('@fastify/formbody'));

    await fastify.register(require('@fastify/multipart'), {
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });

    await fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '..', 'public'),
        prefix: '/'
    });

    const nunjucks = require('nunjucks');
    const nunjucksEnv = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(path.join(__dirname, '..', 'views')),
        { autoescape: true, noCache: true }
    );

    nunjucksEnv.addFilter('date', (str) => {
        if (!str) return '';
        const d = new Date(str);
        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    });

    nunjucksEnv.addFilter('truncate', (str, length) => {
        if (!str) return '';
        length = length || 100;
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    });

    nunjucksEnv.addFilter('upper', (str) => {
        if (!str) return '';
        return str.toUpperCase();
    });

    nunjucksEnv.addFilter('lower', (str) => {
        if (!str) return '';
        return str.toLowerCase();
    });

    nunjucksEnv.addFilter('capitalize', (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    await fastify.register(require('@fastify/view'), {
        engine: { nunjucks },
        templates: path.join(__dirname, '..', 'views'),
        options: {
            onConfigure: (env) => {
                env.addFilter('date', nunjucksEnv.getFilter('date'));
                env.addFilter('truncate', nunjucksEnv.getFilter('truncate'));
                env.addFilter('upper', nunjucksEnv.getFilter('upper'));
                env.addFilter('lower', nunjucksEnv.getFilter('lower'));
                env.addFilter('capitalize', nunjucksEnv.getFilter('capitalize'));
            }
        }
    });

    await fastify.register(require('./routes/homeRoutes'));
    await fastify.register(require('./routes/authRoutes'));
    await fastify.register(require('./routes/postRoutes'));
    await fastify.register(require('./routes/uploadRoutes'));

    fastify.setNotFoundHandler((request, reply) => {
        reply.status(404).view('errors/404.njk', {
            title: 'Página no encontrada',
            url: request.url,
            session: request.session || {}
        });
    });

    fastify.setErrorHandler((error, request, reply) => {
        fastify.log.error(error);
        reply.status(500).view('errors/500.njk', {
            title: 'Error del servidor',
            error: {
                message: error.message,
                stack: process.env.NODE_ENV === 'production' ? null : error.stack
            },
            session: request.session || {}
        });
    });

    return fastify;
}

async function start() {
    try {
        const app = await build();
        await sequelize.sync();
        console.log('Base de datos sincronizada.');
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Servidor escuchando en http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
