const { sequelize, User, Post } = require('../models');

async function migrate() {
    try {
        await sequelize.sync({ force: true });
        console.log('Base de datos sincronizada correctamente.');

        const admin = await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        const editor = await User.create({
            name: 'Editor',
            email: 'editor@example.com',
            password: 'editor123',
            role: 'editor'
        });

        const user = await User.create({
            name: 'Usuario',
            email: 'user@example.com',
            password: 'user123',
            role: 'user'
        });

        await Post.bulkCreate([
            {
                title: 'Bienvenido a MVC Fastify',
                content: 'Esta es una aplicación de ejemplo que demuestra el patrón MVC con Fastify, Sequelize y Nunjucks.',
                userId: admin.id
            },
            {
                title: 'Gestión de plantillas con Nunjucks',
                content: 'Nunjucks es un motor de plantillas potente que permite usar variables, filtros, herencia de plantillas y estructuras de control.',
                userId: editor.id
            },
            {
                title: 'Persistencia con Sequelize',
                content: 'Sequelize es un ORM para Node.js que soporta PostgreSQL, MySQL, MariaDB, SQLite y MSSQL. En esta app usamos SQLite.',
                userId: user.id
            }
        ]);

        console.log('Datos de ejemplo creados:');
        console.log('  Admin: admin@example.com / admin123');
        console.log('  Editor: editor@example.com / editor123');
        console.log('  Usuario: user@example.com / user123');
        console.log('Migración completada.');

        process.exit(0);
    } catch (error) {
        console.error('Error en la migración:', error);
        process.exit(1);
    }
}

migrate();
