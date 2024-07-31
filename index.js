const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;

// Endpoint inicial para a chamada
app.post('/twiml', (req, res) => {
    const twimlResponse = `
        <Response>
            <Gather input="speech" action="/process-name" method="POST" language="pt-BR">
                <Say voice="alice" language="pt-BR">Olá! Por favor, diga seu nome.</Say>
            </Gather>
            <Say voice="alice" language="pt-BR">Desculpe, não entendi. Por favor, tente novamente.</Say>
        </Response>
    `;
    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);
});

// Endpoint para processar o nome do usuário
app.post('/process-name', async (req, res) => {
    const speechResult = req.body.SpeechResult;
    console.log('Nome do usuário:', speechResult);

    // Enviar o nome do usuário ao Dify para gerar a mensagem de boas-vindas
    const difyResponse = await axios.post('https://api.dify.com/process', { input: speechResult });
    const difyReply = difyResponse.data.reply;

    // Responder ao usuário com a mensagem de boas-vindas
    const twimlResponse = `
        <Response>
            <Say voice="alice" language="pt-BR">${difyReply}</Say>
            <Pause length="2" />
            <Hangup />
        </Response>
    `;
    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
