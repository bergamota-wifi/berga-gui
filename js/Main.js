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
}