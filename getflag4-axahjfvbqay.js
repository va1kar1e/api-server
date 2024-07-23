import {
	convertWordToLowercase,
	convertWordToUppercase,
	convertWordToLowerAtIndex,
	convertWordToUpperAtIndex,
	replaceCharacterInWords,
} from "./scripts.js";

function generateFlag(word, index) {
	let newword;
	if (!word) return word; // Return empty if word is falsy

	switch (index) {
		case 6:
			newword = word;
			break;
		case 5:
			newword = convertWordToUppercase(word);
			newword = convertWordToLowerAtIndex(newword, 1);
			newword = replaceCharacterInWords(newword, "e", "3");
			break;
		case 4:
			newword = convertWordToUppercase(word);
			newword = convertWordToLowerAtIndex(newword, 1);
			newword = replaceCharacterInWords(newword, "o", "0");
			break;
		case 3:
			newword = convertWordToLowercase(word);
			newword = convertWordToUpperAtIndex(newword, 0);
			newword = convertWordToUpperAtIndex(newword, 6);
			newword = replaceCharacterInWords(newword, "i", "1");
			newword = replaceCharacterInWords(newword, "o", "0");
			break;
		case 2:
			newword = convertWordToUppercase(word);
			newword = convertWordToLowerAtIndex(newword, 3);
			newword = convertWordToLowerAtIndex(newword, 6);
			break;
		case 1:
			newword = convertWordToLowercase(word);
			newword = convertWordToUpperAtIndex(newword, 0);
			newword = convertWordToUpperAtIndex(newword, 2);
			newword = convertWordToUpperAtIndex(newword, 5);
			newword = replaceCharacterInWords(newword, "s", "5");
			break;
		default:
			newword = convertWordToUppercase(word);
			newword = convertWordToLowerAtIndex(newword, 1);
			newword = convertWordToLowerAtIndex(newword, 4);
			newword = convertWordToLowerAtIndex(newword, 6);
			newword = convertWordToLowerAtIndex(newword, 9);
			newword = replaceCharacterInWords(newword, "s", "5");
	}

	return newword;
}

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

function getCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function getQueryParams() {
	const jwtParam = getCookie("jwt");
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
		return payloadData.flagWord
			? atob(payloadData.flagWord).split(",").map(Number)
			: [];
	} catch (error) {
		console.error("Error decoding base64-encoded JWT:", error);
		return [];
	}
}

function displayWords(words) {
	const wordList = document.getElementById("wordList");
	let flag = "KTBREDTEAM{FLAG4-";
	words.forEach((word, index) => {
		let w = generateFlag(word, index);
		flag += index !== words.length - 1 ? `${w}_` : w;
	});
	flag += "}";
	wordList.textContent = flag;
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
