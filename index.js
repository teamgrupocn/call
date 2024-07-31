const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

    if (!speechResult) {
        const twimlResponse = `
            <Response>
                <Say voice="alice" language="pt-BR">Desculpe, não consegui capturar o seu nome. Por favor, tente novamente.</Say>
                <Redirect>/twiml</Redirect>
            </Response>
        `;
        res.set('Content-Type', 'text/xml');
        return res.send(twimlResponse);
    }

    // Enviar o nome do usuário ao Dify para gerar a mensagem de boas-vindas
    try {
        const difyResponse = await axios.post('https://web-production-64d2.up.railway.app/process', { input: speechResult }, {
            auth: {
                username: 'ferramentas@anthonymiranda.com.br',  // substitua pelo seu nome de usuário Dify
                password: 'SQChBn7SQNVHn9s'  // substitua pela sua senha Dify
            }
        });
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
    } catch (error) {
        console.error('Erro ao processar o nome:', error);
        const twimlResponse = `
            <Response>
                <Say voice="alice" language="pt-BR">Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.</Say>
                <Hangup />
            </Response>
        `;
        res.set('Content-Type', 'text/xml');
        res.send(twimlResponse);
    }
});

// Endpoint para gerar a mensagem de boas-vindas
app.post('/process', (req, res) => {
    const { input } = req.body;
    const reply = `Olá ${input}, seja bem-vindo(a)!`;

    res.json({ reply });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
