"use strict";

class Menu {

	constructor () {
		this.mount();
	}

	get list () {
		return [
			"wireless",
			"lanwan"
		];
	}

	mount () {
		let nav       = document.querySelector("nav");
		nav.innerHTML = "";

		this.list.forEach((menu, index) => {
			let div   = document.createElement("div");
			let label = document.createElement("span");
			let br    = document.createElement("br");
			let icon  = document.createElement("img");

			label.textContent = _t(menu);

			icon.setAttribute("src", "img/" + menu + ".png");
			div.setAttribute("title", _t(menu));

			div.appendChild(icon);
			div.appendChild(br);
			div.appendChild(label);
			nav.appendChild(div);

			div.addEventListener("click", () => {
				window.fetch("html/" + menu + ".html?v=" + (new Date()).getTime()).then(response => {
					response.text().then(html => {
						document.querySelector("main").innerHTML = html;
					});
				});
			}, false);

			if (!index){
				div.click();
			}
		});
	}
}