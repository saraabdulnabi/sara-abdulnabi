// Simple authentication middleware

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (token === "mysecrettoken") {
        next(); // allow access
    } else {
        res.status(401).json({ message: "Unauthorized ❌" });
    }
};
