const searchElem = document.getElementById("search");
const buttonElem = document.getElementById("searchBtn");
const errorElem = document.getElementById("error");
const listElem = document.getElementById("list");
const emptyElem = document.getElementById("empty");

buttonElem.addEventListener("click", async (event) => {
	try {
		error.innerHTML = "";
		listElem.innerHTML = "";
		emptyElem.style.display = "none";

		const query = searchElem.value;

		if (!query) {
			error.innerHTML = "Please enter search query!";
			return;
		}

		// requesting to server with query
		const response = await fetch(`/search?q=${query}`);
		const { status, data } = await response.json();

		if (status === "success") {
			if (data.length > 0) {
				// creating element and appending in ul
				data.forEach((element) => {
					const tempListItem = document.createElement("li");
					tempListItem.classList = "list-group-item";

					const tempFileName = document.createElement("p");
					tempFileName.innerHTML = element.name;

					const tempLinkItem = document.createElement("a");
					tempLinkItem.innerHTML = "Download Now";
					tempLinkItem.href = element.url;
					tempLinkItem.classList = "ms-4";

					const tempDivItem = document.createElement("div");
					tempDivItem.classList = "d-flex";

					tempDivItem.appendChild(tempFileName);
					tempDivItem.appendChild(tempLinkItem);

					tempListItem.appendChild(tempDivItem);

					listElem.appendChild(tempListItem);
				});
			} else {
				emptyElem.style.display = "block";
			}
		}
	} catch (error) {
		console.log(error);
	}
});
