import {
	convertWordToLowercase,
	convertWordToUppercase,
	convertWordToLowerAtIndex,
	convertWordToUpperAtIndex,
	replaceCharacterInWords,
	getQueryParams,
	fetchWordList,
} from "./scripts.js";

function generateFlag(word, index) {
	switch (index) {
		case 2:
			newword = convertWordToLowercase(word);
			newword = convertWordToUpperAtIndex(newword, 0);
			newword = convertWordToLowerAtIndex(newword, 3);
			newword = replaceCharacterInWords(newword, "s", "5");
			break;
		case 1:
			newword = convertWordToLowercase(word);
			newword = convertWordToUpperAtIndex(newword, 0);
			newword = replaceCharacterInWords(newword, "b", "13");
			break;
		default:
			newword = convertWordToUppercase(word);
			newword = convertWordToLowerAtIndex(newword, 1);
			newword = convertWordToLowerAtIndex(newword, 6);
	}

	newword = replaceCharacterInWords(newword, "o", "0");
	return newword;
}

function displayWords(words) {
	const wordList = document.getElementById("wordList");
	var flag = "KTBREDTEAM{FLAG3-";
	console.log(words);
	words.forEach((word, index) => {
		w = generateFlag(word);
		flag += index !== words.length - 1 ? `${w}_` : w;
	});
	flag += "}";
	wordList.textContent = flag;
}

// Fetch and display words when the page loads
window.onload = () => {
	const indices = getQueryParams();
	if (indices.length > 0) {
		const wordlist = fetchWordList(indices);
		console.log(wordlist);
		displayWords(wordlist);
	} else {
		console.error("No valid indices provided");
	}
};
