const { User } = require('../models');

class AuthController {
    async showRegister(request, reply) {
        const flash = request.session.flash || {};
        request.session.flash = {};
        return reply.view('auth/register.njk', {
            title: 'Registro',
            flash,
            session: request.session
        });
    }

    async register(request, reply) {
        try {
            const { name, email, password, password_confirm } = request.body;

            if (!name || !email || !password) {
                request.session.flash = { error: 'Todos los campos son obligatorios.' };
                return reply.redirect('/register');
            }

            if (password !== password_confirm) {
                request.session.flash = { error: 'Las contraseñas no coinciden.' };
                return reply.redirect('/register');
            }

            if (password.length < 6) {
                request.session.flash = { error: 'La contraseña debe tener al menos 6 caracteres.' };
                return reply.redirect('/register');
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                request.session.flash = { error: 'Ya existe un usuario con este email.' };
                return reply.redirect('/register');
            }

            const user = await User.create({ name, email, password });

            request.session.userId = user.id;
            request.session.userName = user.name;
            request.session.userEmail = user.email;
            request.session.userRole = user.role;
            request.session.flash = { success: `¡Bienvenido/a, ${user.name}! Registro exitoso.` };

            return reply.redirect('/posts');
        } catch (error) {
            request.session.flash = { error: 'Error al registrar el usuario. Inténtalo de nuevo.' };
            return reply.redirect('/register');
        }
    }

    async showLogin(request, reply) {
        const flash = request.session.flash || {};
        request.session.flash = {};
        return reply.view('auth/login.njk', {
            title: 'Iniciar Sesión',
            flash,
            session: request.session
        });
    }

    async login(request, reply) {
        try {
            const { email, password } = request.body;

            if (!email || !password) {
                request.session.flash = { error: 'Email y contraseña son obligatorios.' };
                return reply.redirect('/login');
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                request.session.flash = { error: 'Credenciales incorrectas.' };
                return reply.redirect('/login');
            }

            const valid = await user.validPassword(password);
            if (!valid) {
                request.session.flash = { error: 'Credenciales incorrectas.' };
                return reply.redirect('/login');
            }

            request.session.userId = user.id;
            request.session.userName = user.name;
            request.session.userEmail = user.email;
            request.session.userRole = user.role;
            request.session.flash = { success: `¡Hola de nuevo, ${user.name}!` };

            return reply.redirect('/posts');
        } catch (error) {
            request.session.flash = { error: 'Error al iniciar sesión.' };
            return reply.redirect('/login');
        }
    }

    async logout(request, reply) {
        request.session.destroy();
        return reply.redirect('/');
    }
}

module.exports = new AuthController();
