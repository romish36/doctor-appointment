const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        // Step 1: Check if header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({
                message: 'Authorization header missing or malformed',
                success: false,
            });
        }

        // Step 2: Extract token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Auth Failed: No token',
            });
        }

        // Step 3: Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.id;
        // Step 4: Attach user ID to request
        //req.body.userId = decoded.id;

        // Step 5: Proceed
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).send({ message: 'Auth Failed', success: false });
    }
};
