async function requireLogin(request, reply) {
    if (!request.session || !request.session.userId) {
        request.session.flash = { error: 'Debes iniciar sesión para acceder a esta página.' };
        return reply.redirect('/login');
    }
}

module.exports = { requireLogin };
