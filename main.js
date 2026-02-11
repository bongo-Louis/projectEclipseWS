const hideLoading = () => {
	const loadingScreen = document.getElementById("loading-screen");
	if (loadingScreen) {
		loadingScreen.classList.add("hidden");
	}

	document.body.classList.remove("is-loading");
};

const restDbConfig = {
	baseUrl: "https://bongiku-dc4e.restdb.io/rest",
	collection: "Bongiku",
	apiKey: "698c246ebf4bcc668d53e4aa"
};

const initializeLoginForm = () => {
	const loginForm = document.querySelector("[data-login-form]");
	if (!loginForm) return;

	const messageEl = loginForm.querySelector(".login-message");

	loginForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(loginForm);
		const username = String(formData.get("username") || "").trim();
		const password = String(formData.get("password") || "").trim();

		if (!username || !password) {
			if (messageEl) {
				messageEl.textContent = "Please enter your username and password.";
			}
			return;
		}

		if (messageEl) {
			messageEl.textContent = "Checking your details...";
		}

		const query = encodeURIComponent(JSON.stringify({ username, password }));
		const endpoint = `${restDbConfig.baseUrl}/${restDbConfig.collection}?q=${query}`;

		try {
			const response = await fetch(endpoint, {
				method: "GET",
				headers: {
					"x-apikey": restDbConfig.apiKey,
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				throw new Error("Login request failed.");
			}

			const results = await response.json();
			if (Array.isArray(results) && results.length > 0) {
				sessionStorage.setItem("authUser", username);
				const redirectTo = loginForm.getAttribute("data-redirect") || "characters.html";
				window.location.href = redirectTo;
				return;
			}

			if (messageEl) {
				messageEl.textContent = "Invalid username or password.";
			}
		} catch (error) {
			if (messageEl) {
				messageEl.textContent = "Unable to reach the login service. Please try again.";
			}
		}
	});
};

const updateLoginButton = () => {
	const loginButton = document.querySelector(".nav-login-button");
	if (!loginButton) return;

	const authUser = sessionStorage.getItem("authUser");
	if (authUser) {
		loginButton.textContent = "Account";
		loginButton.setAttribute("aria-label", `Account for ${authUser}`);
		const accountHref = loginButton.getAttribute("data-account-href");
		if (accountHref) {
			loginButton.href = accountHref;
		}
	}
};

// Character data
const characterData = {
	tora: {
		name: "Tora",
		subtitle: "The Incineroar",
		description: "\"It's rough and aggressive behavior is its most notable trait, but the way it helps out small Pokémon shows that it has a kind side as well.\"",
		image: "../img/Tora.png",
		color: "#e7837e"
	},
	mimi: {
		name: "Mimi",
		subtitle: "The Mimikyu",
		description: "\"A shy Pokémon that hides its true form under a rag to avoid frightening others. Doesn't mean it lacks a brave soul.\"",
		image: "../img/Mimi.png",
		color: "#e2d76e"
	},
	necro: {
		name: "Necro",
		subtitle: "The Necrozma",
		description: "\"The ultimate lifeform.\"",
		image: "../img/Necro.png",
		color: "#000000"
	},
	luna: {
		name: "Luna",
		subtitle: "The Lunala",
		description: "\"It serves as an emissary of the night. The embodiment of the moon's grace and serenity.\"",
		image: "../img/Luna.png",
		color: "#bda4e9"
	},
	sol: {
		name: "Sol",
		subtitle: "The Solgaleo",
		description: "\"It serves as an emissary of the day. The embodiment of the sun's power and courage.\"",
		image: "../img/Sol.png",
		color: "#e9c3a3"
	}
};

// Initialize character switching
const initializeCharacterSwitching = () => {
	const thumbnailButtons = document.querySelectorAll(".character-thumb");
	const redTriangle = document.querySelector(".red-triangle");
	const necroSpamText = "The ultimate lifeform.";
	const necroSpamLinesPerTick = 1;
	const necroSpamIntervalMs = 600;
	const necroGlitchHoldMs = 140;
	const necroGlitchChars = "ÅßĦŁØΨЖあカタナΣλΩ";
	let necroSpamBuffer = "";
	let necroSpamAdds = 0;
	let necroSpamTimer = null;
	let necroGlitchTimer = null;

	thumbnailButtons.forEach(button => {
		button.addEventListener("click", () => {
			const characterKey = button.getAttribute("data-character");
			const character = characterData[characterKey];
			const characterCard = document.querySelector(".character-card");
			const redTriangleText = document.querySelector(".red-triangle-text");

			if (!character) return;

			// Update active button
			thumbnailButtons.forEach(btn => btn.classList.remove("active"));
			button.classList.add("active");

			// Update character image
			const charImage = document.querySelector(".character-image img");
			if (charImage) {
				charImage.src = character.image;
				charImage.alt = character.name;
			}

			// Update character info
			const charInfo = document.querySelector(".character-info");
			if (charInfo) {
				const description = charInfo.querySelector("p");
				charInfo.querySelector("h1").textContent = character.name;
				charInfo.querySelector("h2").textContent = character.subtitle;

				if (necroSpamTimer) {
					clearInterval(necroSpamTimer);
					necroSpamTimer = null;
				}

				if (necroGlitchTimer) {
					clearTimeout(necroGlitchTimer);
					necroGlitchTimer = null;
				}

				if (characterKey === "necro" && description) {
					necroSpamBuffer = necroSpamText;
					necroSpamAdds = 0;
					description.textContent = necroSpamBuffer;

					const glitchText = (text) => {
						const chars = text.split("");
						for (let i = 0; i < chars.length; i += 1) {
							if (chars[i] === " " || Math.random() > 0.08) {
								continue;
							}
							const idx = Math.floor(Math.random() * necroGlitchChars.length);
							chars[i] = necroGlitchChars[idx];
						}
						return chars.join("");
					};

					necroSpamTimer = setInterval(() => {
						if (necroSpamAdds < 10) {
							let spamChunk = "";
							for (let i = 0; i < necroSpamLinesPerTick; i += 1) {
								spamChunk += ` ${necroSpamText}`;
							}
							necroSpamBuffer += spamChunk;
							necroSpamAdds += 1;
						}
						description.textContent = glitchText(necroSpamBuffer);
						necroGlitchTimer = setTimeout(() => {
							description.textContent = necroSpamBuffer;
						}, necroGlitchHoldMs);
					}, necroSpamIntervalMs);
				} else if (description) {
					necroSpamBuffer = "";
					necroSpamAdds = 0;
					description.textContent = character.description;
				}
			}

			// Update red triangle color
			if (redTriangle) {
				redTriangle.style.backgroundColor = character.color;
			}

			if (redTriangleText) {
				redTriangleText.classList.toggle("light", characterKey === "necro");
			}

			if (characterCard) {
				characterCard.classList.remove("animate");
				void characterCard.offsetWidth;
				characterCard.classList.add("animate");
			}
		});
	});
};

window.addEventListener("load", () => {
	const hasLoadedOnce = sessionStorage.getItem("hasLoadedOnce");

	if (hasLoadedOnce) {
		hideLoading();
	} else {
		sessionStorage.setItem("hasLoadedOnce", "true");
		setTimeout(hideLoading, 1500);
	}

	// Initialize character switching on characters page
	if (document.querySelector(".character-thumb")) {
		initializeCharacterSwitching();
		const redTriangleText = document.querySelector(".red-triangle-text");
		if (redTriangleText) {
			redTriangleText.classList.toggle("light", document.querySelector(".character-thumb.active")?.getAttribute("data-character") === "necro");
		}
	}

	initializeLoginForm();
	updateLoginButton();
});

window.addEventListener("pageshow", () => {
	// Ensure loader is hidden when returning via back/forward cache
	hideLoading();
});
