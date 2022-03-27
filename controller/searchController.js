const esClient = require("../connection/elasticSearch");

const runSearchFilter = async (req, res, next) => {
	try {
		const query = req.query.q.trim();

		if (!query) {
			res.send({ status: "error", message: "invalid parameters!" });
		}

		//searching elastic with query
		const matchedResults = await esClient.search({
			index: "files_data",
			query: {
				match: { fileContent: query },
			},
		});

		const results = matchedResults.hits.hits;

		// preparing results to send
		const newResults = results.map((result) => {
			return {
				id: result._id,
				name: result._source.name,
				url: result._source.url,
				fileContent: result._source.fileContent,
			};
		});

		res.send({ status: "success", data: newResults });
	} catch (error) {
		console.log("Error in runSearchFilter! ", error);
		res.send({ status: "error", message: "Something went wrong!" });
	}
};

module.exports = {
	runSearchFilter,
};
