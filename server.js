const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

app.use("/*", (req, res, next) => {
	res.send("Hello world!");
});

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}!`);
});
