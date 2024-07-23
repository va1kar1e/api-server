// Function to fetch the wordlist.txt file
export async function fetchWordList(indices) {
	try {
		const response = await fetch("rockyou-75.txt");
		const text = await response.text();
		const words = text.split("\n").filter((word) => word.trim() !== "");

		// Map the specified indices to the words array, adjusting for zero-based index
		const selectedWords = indices.map((index) => words[index - 1]);

		// Convert words array to JSON
		const wordsJSON = JSON.stringify(selectedWords);
		return JSON.parse(wordsJSON);
	} catch (error) {
		console.error("Error fetching wordlist:", error);
	}
}

export function getQueryParams() {
	const params = new URLSearchParams(window.location.search);
	const jwtParam = params.get("jwt");
	if (jwtParam) {
		return parseBase64EncodedJWT(jwtParam);
	}
	return [];
}

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

export function convertWordToUppercase(word) {
	if (!word) return word; // Return empty if word is falsy
	return word.toUpperCase();
}

export function convertWordToLowercase(word) {
	if (!word) return word; // Return empty if word is falsy
	return word.toLoweCase();
}

export function convertWordToUpperAtIndex(word, index) {
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

export function convertWordToLowerAtIndex(word, index) {
	if (!word) return word; // Return empty if word is falsy
	if (index < word.length) {
		// Capitalize the character at the specified index
		return (
			word.substring(0, index) +
			word.charAt(index).toLowerCase() +
			word.substring(index + 1)
		);
	}
	return word;
}

export function replaceCharacterInWords(word, oldChar, newChar) {
	const regex = new RegExp(oldChar, "gi"); // 'g' for global, 'i' for case-insensitive
	return word.replace(regex, newChar);
}
