require("dotenv").config();

const path = require("path");
const express = require("express");

const searchController = require("./controller/searchController");
const prepareDataAndIndex = require("./utils/prepareDataAndIndex");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/search", searchController.runSearchFilter);

prepareDataAndIndex().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on PORT ${PORT}!`);
	});
});
