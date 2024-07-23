// Function to fetch the wordlist.txt file
async function fetchWordList(indices) {
	try {
		const response = await fetch("rockyou-75.txt");
		const text = await response.text();
		const words = text.split("\n").filter((word) => word.trim() !== "");

		// Map the specified indices to the words array, adjusting for zero-based index
		const selectedWords = indices.map((index) => words[index - 1]);

		// Convert words array to JSON
		const wordsJSON = JSON.stringify(selectedWords);
		displayWords(JSON.parse(wordsJSON));
	} catch (error) {
		console.error("Error fetching wordlist:", error);
	}
}

// Function to display words in the ul element
function displayWords(i, words) {
	const wordList = document.getElementById("wordList");
	wordList.textContent =
		"KTBREDTEAM{FLAG" + i + "_" + words.join(" - ") + "}";
}

// Function to get query parameters from the URL
function getQueryParams() {
	const params = new URLSearchParams(window.location.search);
	const jwtParam = params.get("jwt");
	if (jwtParam) {
		return parseBase64EncodedJWT(jwtParam);
	}
	return [];
}

// Function to parse the JWT
function parseBase64EncodedJWT(base64Jwt) {
	try {
		// Decode the base64-encoded JWT to get the actual JWT
		const decodedBase64 = atob(base64Jwt);

		// Split the JWT into its components
		const [header, payload, signature] = decodedBase64.split(".");

		// Decode the payload (base64-encoded JSON)
		const base64Url = payload;
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => {
					return (
						"%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
					);
				})
				.join("")
		);

		// Parse the JSON payload to extract indices
		const payloadData = JSON.parse(jsonPayload);
		return payloadData.flagWord || [];
	} catch (error) {
		console.error("Error decoding base64-encoded JWT:", error);
		return [];
	}
}

// Fetch and display words when the page loads
window.onload = () => {
	const indices = getQueryParams();
	if (indices.length > 0) {
		fetchWordList(indices);
	} else {
		console.error("No valid indices provided");
	}
};
