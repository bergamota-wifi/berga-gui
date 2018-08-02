"use strict";

class Form {

	static get url () {
		let url       = window.location.href.replace(/#.*/, "").replace(/\/$/, "");
		let bergamota = "/cgi-bin/berga-rpc";
		return url + bergamota;
	}

	static submit (form) {
		let dados  = this.serialize(form);
		let method = form.getAttribute("action");
		console.log(this.url, method, dados);
		return false;
	}

	static serialize (form) {
		let dados  = {};
		let inputs = form.querySelectorAll("input, select");
		inputs.forEach(input => {
			dados[input.id] = input.value;
		});
		return dados;
	}
}