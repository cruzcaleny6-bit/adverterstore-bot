exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { productName, amount, buyerEmail } = JSON.parse(event.body);

        const API_USERNAME = process.env.PROMISEPAY_USERNAME;
        const API_TOKEN = process.env.PROMISEPAY_TOKEN;

        if (!API_USERNAME || !API_TOKEN) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Credenciais da API não configuradas' })
            };
        }

        const auth = Buffer.from(`${API_USERNAME}:${API_TOKEN}`).toString('base64');

        // Criar item na PromisePay
        const itemResponse = await fetch('https://api.promisepay.com/v2/items', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: productName,
                amount: amount,
                payment_type_id: 1,
                buyer_id: buyerEmail,
                seller_id: process.env.SELLER_ID || 'adverter_marketplace'
            })
        });

        const itemData = await itemResponse.json();

        if (!itemResponse.ok) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: itemData.error || 'Erro na PromisePay' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                itemId: itemData.id,
                checkoutUrl: `https://checkout.promisepay.com/${itemData.id}`
            })
        };
    } catch (error) {
        console.error('Erro:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno no servidor' })
        };
    }
};
