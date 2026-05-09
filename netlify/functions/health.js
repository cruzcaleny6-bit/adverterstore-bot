exports.handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok', message: 'Bot AdverterStore online' })
    };
};
