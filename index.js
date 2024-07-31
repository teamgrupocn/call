const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.post('/twiml', (req, res) => {
    const twimlResponse = `
        <Response>
            <Say voice="alice" language="pt-BR">Olá, esta é uma mensagem personalizada, agora ALicy e hora de fazer muita grana.</Say>
        </Response>
    `;
    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
