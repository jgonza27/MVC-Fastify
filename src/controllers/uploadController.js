const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream/promises');

class UploadController {
    async showForm(request, reply) {
        const flash = request.session.flash || {};
        request.session.flash = {};
        return reply.view('uploads/form.njk', {
            title: 'Subir Archivo',
            flash,
            session: request.session
        });
    }

    async handleUpload(request, reply) {
        try {
            const data = await request.file();

            if (!data) {
                request.session.flash = { error: 'No se ha seleccionado ningún archivo.' };
                return reply.redirect('/upload');
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
            if (!allowedTypes.includes(data.mimetype)) {
                request.session.flash = { error: 'Tipo de archivo no permitido. Solo se aceptan imágenes, PDF y texto.' };
                return reply.redirect('/upload');
            }

            const maxSize = 5 * 1024 * 1024;
            const timestamp = Date.now();
            const ext = path.extname(data.filename);
            const safeName = `${timestamp}-${data.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
            const filePath = path.join(uploadDir, safeName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const writeStream = fs.createWriteStream(filePath);
            await pipeline(data.file, writeStream);

            const stats = fs.statSync(filePath);
            if (stats.size > maxSize) {
                fs.unlinkSync(filePath);
                request.session.flash = { error: 'El archivo excede el tamaño máximo de 5MB.' };
                return reply.redirect('/upload');
            }

            request.session.flash = {
                success: 'Archivo subido exitosamente.',
                uploadedFile: {
                    name: data.filename,
                    savedAs: safeName,
                    size: (stats.size / 1024).toFixed(2) + ' KB',
                    type: data.mimetype,
                    url: `/uploads/${safeName}`
                }
            };

            return reply.redirect('/upload');
        } catch (error) {
            request.session.flash = { error: 'Error al subir el archivo: ' + error.message };
            return reply.redirect('/upload');
        }
    }
}

module.exports = new UploadController();
