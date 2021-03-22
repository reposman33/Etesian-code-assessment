export const getNextPrime = (number) => {
	let found = false;
	while (!found) {
		number++;
		if (isPriemgetal(number)) {
			found = true;
		}
	}
	return number;
}

const isPriemgetal = (number) => {
	for (let i = 2; i < number; i++) {
		if (Number.isInteger(number / i)) {
			return false;
		}
		return true;
	}
}
