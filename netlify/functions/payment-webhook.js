exports.handler = async (event) => {
    const paymentData = JSON.parse(event.body);
    
    if (paymentData.status === 'completed' || paymentData.event === 'payment.completed') {
        
        const buyerEmail = paymentData.buyer_email || paymentData.buyer_id;
        const productName = paymentData.item_name || paymentData.name;
        
        await sendEmail(buyerEmail, productName);
        
        console.log(`✅ Email enviado para: ${buyerEmail} - ${productName}`);
    }
    
    return { statusCode: 200 };
};

async function sendEmail(to, productName) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const INSTAGRAM = '@tchaikosvisky_';
    
    await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'AdverterStore <onboarding@resend.dev>',
            to: to,
            subject: `✅ Pagamento confirmado - ${productName}`,
            html: `
                <div style="font-family: monospace; background: #0a0f1e; padding: 30px; border-radius: 20px;">
                    <h2 style="color: #1effbc;">AdverterStore</h2>
                    <h3>✅ Pagamento confirmado!</h3>
                    <p>Seu pedido: <strong>${productName}</strong></p>
                    <p>Entre em contato no Instagram para receber seu produto:</p>
                    <div style="background: #1effbc20; padding: 15px; border-radius: 12px; margin: 20px 0; text-align: center;">
                        📱 <strong style="font-size: 1.5rem;">${INSTAGRAM}</strong>
                    </div>
                    <p>Envie o comprovante e seu produto será entregue imediatamente.</p>
                    <hr style="border-color: #1effbc30; margin: 20px 0;">
                    <p style="font-size: 0.8rem;">AdverterStore - Equipe de vendas</p>
                </div>
            `
        })
    });
}
