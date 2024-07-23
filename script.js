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

function convertWordToUppercase(word) {
	if (!word) return word; // Return empty if word is falsy
	return word.toUpperCase();
}

function convertWordToLowercase(word) {
	if (!word) return word; // Return empty if word is falsy
	return word.toLoweCase();
}

function convertWordToUpperAtIndex(word, index) {
	if (!word) return word; // Return empty if word is falsy
	if (index < word.length) {
		// Capitalize the character at the specified index
		return (
			word.substring(0, index) +
			word.charAt(index).toUpperCase() +
			word.substring(index + 1)
		);
	}
	return word;
}

function convertWordToLowerAtIndex(word, index) {
	if (!word) return word; // Return empty if word is falsy
	if (index < word.length) {
		// Capitalize the character at the specified index
		return (
			word.substring(0, index) +
			word.charAt(index).toLoweCase() +
			word.substring(index + 1)
		);
	}
	return word;
}

function replaceCharacterInWords(word, oldChar, newChar) {
	const regex = new RegExp(oldChar, "gi"); // 'g' for global, 'i' for case-insensitive
	return word.replace(regex, newChar);
}

function generateWord(word, index) {
	if (index % 2 == 0) {
		newword = convertWordToLowercase(word);
		newword = convertWordToUpperAtIndex(newword, 3);
		newword = convertWordToUpperAtIndex(newword, 6);
	} else {
		newword = convertWordToUppercase(word);
		newword = convertWordToLowerAtIndex(newword, 2);
		newword = convertWordToLowerAtIndex(newword, 4);
	}

	newword = replaceCharacterInWords(newword, "o", "0");
	newword = replaceCharacterInWords(newword, "i", "1");
	newword = replaceCharacterInWords(newword, "t", "4");
	newword = replaceCharacterInWords(newword, "s", "5");
	newword = replaceCharacterInWords(newword, "b", "13");

	return newword;
}

// Function to display words in the ul element
function displayWords(words) {
	const wordList = document.getElementById("wordList");
	flag = "KTBREDTEAM{FLAG3-";
	words.forEach((word, index) => {
		w = generateWord(word);
		flag += index !== words.length - 1 ? `${w}_` : w;
	});
	flag += "}";
	wordList.textContent = flag;
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
