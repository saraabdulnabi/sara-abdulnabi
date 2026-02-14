const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");

app.use(express.json());

// Use routes
app.use("/api/users", userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
