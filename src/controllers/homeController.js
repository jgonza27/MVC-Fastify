class HomeController {
    async index(request, reply) {
        const flash = request.session.flash || {};
        request.session.flash = {};
        return reply.view('home.njk', {
            title: 'Inicio',
            flash,
            session: request.session
        });
    }

    async about(request, reply) {
        return reply.view('about.njk', {
            title: 'Acerca de',
            session: request.session
        });
    }

    async greet(request, reply) {
        const { name } = request.params;
        return reply.view('greet.njk', {
            title: `Saludo a ${name}`,
            name,
            session: request.session
        });
    }

    async cookiesPage(request, reply) {
        const flash = request.session.flash || {};
        request.session.flash = {};
        const userCookies = {
            theme: request.cookies.theme || null,
            language: request.cookies.language || null
        };
        return reply.view('cookies.njk', {
            title: 'Gestión de Cookies',
            userCookies,
            flash,
            session: request.session
        });
    }

    async setCookies(request, reply) {
        const { theme, language, action } = request.body;

        if (action === 'clear') {
            reply.clearCookie('theme');
            reply.clearCookie('language');
            request.session.flash = { success: 'Cookies eliminadas correctamente.' };
        } else {
            if (theme) {
                reply.setCookie('theme', theme, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30,
                    httpOnly: false
                });
            }
            if (language) {
                reply.setCookie('language', language, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30,
                    httpOnly: false
                });
            }
            request.session.flash = { success: 'Cookies guardadas correctamente.' };
        }

        return reply.redirect('/cookies');
    }

    async throwError(request, reply) {
        throw new Error('Este es un error de prueba para demostrar la gestión de errores.');
    }
}

module.exports = new HomeController();
