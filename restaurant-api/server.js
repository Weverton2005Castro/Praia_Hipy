const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint para receber pedidos
app.post('/api/order', async (req, res) => {
    const { items, total, address } = req.body;

    // Montar a mensagem a ser enviada
    const message = `Novo pedido recebido:\n\n` +
        `Itens:\n${items.map(item => `${item.name} - R$ ${item.price}`).join('\n')}\n\n` +
        `Total: R$ ${total}\n` +
        `Endereço: ${address}`;

    // Enviar mensagem para o WhatsApp
    try {
        const response = await axios.post(process.env.WHATSAPP_API_URL, new URLSearchParams({
            From: process.env.WHATSAPP_NUMBER,
            To: process.env.WHATSAPP_NUMBER,
            Body: message
        }), {
            auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN
            }
        });

        res.status(200).json({ message: 'Pedido enviado com sucesso!', data: response.data });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ message: 'Erro ao enviar pedido.' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});