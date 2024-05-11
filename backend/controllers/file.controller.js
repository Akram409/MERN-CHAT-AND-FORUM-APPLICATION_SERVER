import fs from "fs";

// Endpoint to serve files
app.get("/api/files/:filename", async (req, res) => {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`; 
    if (fs.existsSync(filePath)) {
        // Stream the file to the client
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});