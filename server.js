const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
// This tells the server to look inside the 'public' folder for your website files
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/verify', (req, res) => {
    const { code } = req.body;
    if (code.toLowerCase() === 'cute') {
        res.json({ success: true, message: "🎉 You found everyone! Happy Birthday! 🎉" });
    } else {
        res.json({ success: false, message: "Hmm, that's not the right code. Keep exploring!" });
    }
});

app.listen(PORT, () => {
    console.log(`Adventure server running at http://localhost:${PORT}`);
});