/*
*	Contains misc. functions for use in data files
*/ 

let exportedMethods = {
	isString(s) {
		return (typeof s === "string");
	},

	isEmpty(s) {
		if (this.isString(s)) 
			s = s.trim();
		return (s === undefined || s === null || s === "");
	},

	isUndefined(o) {
		return (o === undefined || o === null);
	},

	isObject(o) {
		return (typeof o === 'object')
	},

	isArrayOfStrings(arr) {
		if(!Array.isArray(arr)) {
			return false
		}

		for(let i = 0; i < arr.length; i++) {
			if(!isString(arr[i])) {
				return false;
			}
		}

		return true;
	},

	testArrayStringLengths(arr, len) {
		if(!Array.isArray(arr)) {
			return false
		}

		for(let i = 0; i < arr.length; i++) {
			if(!isString(arr[i]) || arr[i].length > len) {
				return false;
			}
		}

		return true;
	}
}

module.exports = exportedMethods;