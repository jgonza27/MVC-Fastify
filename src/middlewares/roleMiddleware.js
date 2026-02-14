function requireRole(...roles) {
    return async function (request, reply) {
        if (!request.session || !request.session.userId) {
            request.session.flash = { error: 'Debes iniciar sesión para acceder a esta página.' };
            return reply.redirect('/login');
        }

        if (!roles.includes(request.session.userRole)) {
            request.session.flash = { error: 'No tienes permisos para realizar esta acción.' };
            return reply.redirect('/posts');
        }
    };
}

module.exports = { requireRole };
