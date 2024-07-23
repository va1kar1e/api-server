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
		case 2:
			newword = convertWordToLowercase(word);
			newword = convertWordToUpperAtIndex(newword, 0);
			newword = convertWordToLowerAtIndex(newword, 3);

			break;
		case 1:
			newword = convertWordToLowercase(word);
			newword = replaceCharacterInWords(newword, "b", "13");
			newword = convertWordToUpperAtIndex(newword, 0);
			break;
		default:
			newword = convertWordToUppercase(word);
			newword = convertWordToLowerAtIndex(newword, 1);
			newword = convertWordToLowerAtIndex(newword, 6);
			newword = replaceCharacterInWords(newword, "s", "5");
	}

	newword = replaceCharacterInWords(newword, "o", "0");
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

function getQueryParams() {
	const params = new URLSearchParams(window.location.search);
	const flagParam = params.get("flag");
	if (flagParam) {
		return decodeBase64(flagParam);
	}
	return [];
}

function decodeBase64(flag) {
	try {
		const decodedBase64 = atob(flag).split(",").map(Number);
		return decodedBase64;
	} catch (error) {
		console.error("Error decoding base64:", error);
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
