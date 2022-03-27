const fs = require("fs");

const reader = require("any-text");
const esClient = require("../connection/elasticSearch");
const dropbox = require("../connection/dropBox");

const prepareDataAndIndex = () => {
	return new Promise(async (resolve, reject) => {
		try {
			// clearning all indexes
			await esClient.indices.delete({ index: "_all" });

			// fetching list of files and filering
			const allFiles = await dropbox.filesListFolder({ path: "" });

			const filesToRead = allFiles.result.entries.filter((fileObj) => {
				return (
					fileObj[".tag"] === "file" &&
					(fileObj.path_lower.split(".")[1] === "pdf" ||
						fileObj.path_lower.split(".")[1] === "docx")
				);
			});

			// processing each file and inserting extracted data in index
			for (fileObj of filesToRead) {
				const fileContent = await dropbox.filesDownload({
					path: fileObj.path_lower,
				});

				const tempFileName = `./temp/${fileObj.path_lower.substring(1)}`;

				fs.writeFileSync(tempFileName, fileContent.result.fileBinary);

				const tempFileData = await reader.getText(tempFileName);

				const { result: fileData } = await dropbox.filesGetTemporaryLink({
					path: fileObj.path_lower,
				});

				await esClient.index({
					index: "files_data",
					document: {
						name: fileObj.name,
						url: fileData.link,
						fileContent: tempFileData,
					},
				});

				fs.unlinkSync(tempFileName);
			}

			resolve();
		} catch (error) {
			console.log("Error in preparing and indexing data!", error);
		}
	});
};

module.exports = prepareDataAndIndex;
