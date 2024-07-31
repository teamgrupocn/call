const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.post('/twiml', (req, res) => {
    const twimlResponse = `
        <Response>
            <Say voice="alice" language="pt-BR">Anthony aqui e o Javis seu vendedor com IA.</Say>
        </Response>
    `;
    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
