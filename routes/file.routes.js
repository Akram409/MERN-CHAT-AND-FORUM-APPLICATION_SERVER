import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Endpoint to serve files
router.get('/files/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    try {
        if (fs.existsSync(filePath)) {
            // Determine the Content-Type based on the file extension
            let contentType;
            if (filename.endsWith('.pdf')) {
                contentType = 'application/pdf';
            } else if (filename.endsWith('.docx')) {
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            } else {
                // Default to 'application/octet-stream' for unknown file types
                contentType = 'application/octet-stream';
            }

            // Set Content-Disposition header with the original filename
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            // Set Content-Type header
            res.setHeader('Content-Type', contentType);

            // Stream the file to the client
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).json({ error: "File not found" });
        }
    } catch (error) {
        console.error("Error serving file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
