// Test endpoint to verify API is working
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    res.status(200).json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        envConfigured: {
            EMAIL_USER: !!process.env.EMAIL_USER,
            EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
            emailUserValue: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'NOT SET'
        }
    });
};
