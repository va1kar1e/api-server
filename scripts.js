export function convertWordToUppercase(word) {
	if (!word) return word; // Return empty if word is falsy
	return word.toUpperCase();
}

export function convertWordToLowercase(word) {
	if (!word) return word; // Return empty if word is falsy
	return word.toLowerCase();
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
