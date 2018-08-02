function _t (label) {
	if (typeof window[Page.lang][label] === "undefined"){
		return label;
	}
	return window[Page.lang][label];
}