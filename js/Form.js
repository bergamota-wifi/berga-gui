"use strict";

class Form {

	static get RPCversion () {
		return "2.0";
	}

	static get url () {
		let url = window.location.href.replace(/#.*/, "").replace(/\/$/, "");
		let cgi = "/cgi-bin/berga-rpc";
		return url + cgi;
	}

	static submit (form) {
		let send       = {};
		let serialized = this.serialize(form);
		let method     = form.getAttribute("action");
		send.jsonrpc   = this.RPCversion;
		send.method    = method;
		send.params    = serialized;
		send.id        = parseInt(Math.random() * 10000).toString();
		let dados      = JSON.stringify(send);
		let init       = {
			credentials : "include",
			method      : "POST",
			body        : dados,
			headers: {
				"Accept"           : "application/json",
				"Application-Type" : "text/json",
				"Content-Length"   : dados.length,
			}
		};

		window.fetch(this.url, init).then(response => {
			if (!response.ok){
				window.alert(_t("request_failed"));
				return;
			}
			response.json().then((json) => {
				if (typeof json.error !== "undefined"){
					window.alert("[" + json.error.code + "] " + _t("request_failed"));	
					window.console.warn(method, json.error);
				} else {
					window.alert(_t("request_success"));
				}
			}).catch(() => {
				window.alert(_t("request_failed"));
			});
		});

		return false;
	}

	static serialize (form) {
		let dados  = {};
		let inputs = form.querySelectorAll("input, select");
		let nest   = (obj, key_path, value) => {
			let last_key = key_path.length - 1;
			for (let i=0; i<last_key; i++) {
				let key = key_path[i];
				if (!(key in obj)) {
					obj[key] = {};
				}
				obj = obj[key];
			}

			if (typeof obj[key_path[last_key]] === "undefined") {
				obj[key_path[last_key]] = value;
				return;
			}

			if (!Array.isArray(obj[key_path[last_key]])){
				obj[key_path[last_key]] = [obj[key_path[last_key]]];
			}
			obj[key_path[last_key]].push(value);
		};

		inputs.forEach(input => {
			let name = input.getAttribute("name")
				.replace(/\]/g, "")
				.replace(/\[/g, ".")
				.split(".");

			if (name.length === 1){
				dados[name[0]] = input.value;
				return;
			}

			nest(dados, name, input.value);
		});

		return dados;
	}
}