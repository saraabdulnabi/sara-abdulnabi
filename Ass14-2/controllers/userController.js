
exports.getPublicData = (req, res) => {
    res.json({ message: "This is public data" });
};

exports.getProtectedData = (req, res) => {
    res.json({ message: "This is protected data 🔒" });
};
