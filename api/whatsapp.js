const axios = require('axios');

/**
 * WhatsApp Business API integration
 * This module handles sending notifications via WhatsApp Business API
 * 
 * Setup instructions:
 * 1. Get API credentials from Meta for Developers (https://developers.facebook.com/)
 * 2. Set up WhatsApp Business API
 * 3. Add credentials to .env file
 */

const WHATSAPP_CONFIG = {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_API_TOKEN,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    recipientPhone: '573115846717' // Julian's phone number
};

/**
 * Send WhatsApp notification when form is submitted
 * @param {Object} formData - The contact form data
 * @returns {Promise<Object>} - Response from WhatsApp API
 */
async function sendNotification(formData) {
    // Check if WhatsApp API is configured
    if (!WHATSAPP_CONFIG.phoneNumberId || !WHATSAPP_CONFIG.accessToken) {
        console.log('WhatsApp API not configured. Skipping notification.');
        return { success: false, message: 'WhatsApp API not configured' };
    }

    const { name, email, subject, message } = formData;
    
    // Format message for WhatsApp
    const whatsappMessage = `
🔔 *Nuevo mensaje del portafolio*

*De:* ${name}
*Email:* ${email}
*Asunto:* ${subject}

*Mensaje:*
${message}

---
Enviado desde: Portfolio Web
Fecha: ${new Date().toLocaleString('es-CO')}
    `.trim();

    try {
        // WhatsApp Business API endpoint
        const url = `https://graph.facebook.com/v18.0/${WHATSAPP_CONFIG.phoneNumberId}/messages`;
        
        const response = await axios.post(
            url,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: WHATSAPP_CONFIG.recipientPhone,
                type: 'text',
                text: {
                    preview_url: false,
                    body: whatsappMessage
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('WhatsApp notification sent successfully:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Webhook verification for WhatsApp Business API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.VERIFY_TOKEN;

    if (mode && token) {
        if (mode === 'subscribe' && token === verifyToken) {
            console.log('Webhook verified successfully');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
}

/**
 * Handle incoming WhatsApp messages (webhook)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function handleWebhook(req, res) {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        body.entry?.forEach(entry => {
            const changes = entry.changes;
            changes?.forEach(change => {
                if (change.field === 'messages') {
                    const messages = change.value.messages;
                    messages?.forEach(message => {
                        console.log('Received WhatsApp message:', message);
                        // Handle incoming message here
                        // You can implement auto-reply logic if needed
                    });
                }
            });
        });

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

module.exports = {
    sendNotification,
    verifyWebhook,
    handleWebhook,
    WHATSAPP_CONFIG
};
