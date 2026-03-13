const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try{
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedPayload; // Attach user info to request object
        next();
    }catch(err){
        res.status(401).json({ message: 'Invalid token' });
    }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI0M2YxNDRlNGQzMTZlNmExNTc3OGUiLCJlbWFpbCI6ImFudXJhZ0BnbWFpbC5jb20iLCJpYXQiOjE3NzM0MjIwNjAsImV4cCI6MTc3MzUwODQ2MH0.L5gG_OltLqxx4U42VUOVNpvSDTr6lIknn6SoTtXWsB8