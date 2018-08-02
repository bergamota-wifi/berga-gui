"use strict";

class Main {

	init () {
		this._lang = "pt_br";
		this.menu  = new Menu();

		document.querySelector("#msg_footer").textContent = _t("msg_footer");
	}

	get lang () {
		return this._lang;
	}

	set lang (lang) {
		if (["pt_br"].indexOf(lang) !== -1){
			this._lang = lang;
		}
		return this._lang;
	}

	static checkLoad () {
		let loads    = document.querySelectorAll("[data-load]");
		let sanitize = (jsonobj, prefix) => {
			let newobj  = {};
			let recurse = (o, p) => {
				for (let f in o) {
					let pre = (p === undefined ? "" : p + ".");
					if (o[f] && typeof o[f] === "object") {
						newobj = recurse(o[f], pre + f);
					} else {
						if (isNaN(f)){
							newobj[pre + f] = o[f];
							continue;
						}

						pre = pre.replace(/\.$/, "");
						if (typeof newobj[pre] === "undefined"){
							newobj[pre] = [];
						}
						newobj[pre].push(o[f]);
					}
				}
				return newobj;
			};
			return recurse(jsonobj, prefix);
		};
		let f_inputs = (attr, value) => {

			let lattr = attr;
			if (lattr.match(/\./)){
				lattr = attr.replace(".", "[").replace(/\./g, "][") + "]";
			}

			let selector = "[name='" + lattr + "']";
			let input   = document.querySelector(selector);

			if (Array.isArray(value)){
				let arr_inputs = document.querySelectorAll(selector);
				arr_inputs.forEach((input, index) => {
					input.value = value[index];
				});
				return;
			}
			input.value = value;
		};

		loads.forEach(load => {
			let method = load.getAttribute("data-load");
			this.getRPC(method, get => {
				let names = sanitize(get);
				for (let i in names) {
					let name = names[i];
					f_inputs(i, name);
				}
			});
		});
	}

	static getRPC (method, callback = () => {}) {
		let send     = {};
		send.jsonrpc = Form.RPCversion;
		send.method  = method;
		send.params  = "{}";
		send.id      = parseInt(Math.random() * 10000).toString();
		let dados    = JSON.stringify(send);
		let init     = {
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
					window.console.log(method, json.error);
				} else {
					callback(json.result);
				}
			}).catch(() => {
				window.alert(_t("request_failed"));
			});
		});
	}
}