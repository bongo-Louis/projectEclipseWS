const hideLoading = () => {
	const loadingScreen = document.getElementById("loading-screen");
	if (loadingScreen) {
		loadingScreen.classList.add("hidden");
	}

	document.body.classList.remove("is-loading");
};

const restDbConfig = {
	baseUrl: "https://bongiku-dc4e.restdb.io/rest",
	collection: "bongiku",
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

const initializeRegisterForm = () => {
	const registerForm = document.querySelector("[data-register-form]");
	if (!registerForm) return;

	const messageEl = registerForm.querySelector(".login-message");

	registerForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(registerForm);
		const username = String(formData.get("username") || "").trim();
		const password = String(formData.get("password") || "").trim();

		if (!username || !password) {
			if (messageEl) {
				messageEl.textContent = "Please enter a username and password.";
			}
			return;
		}

		if (messageEl) {
			messageEl.textContent = "Creating your account...";
		}

		try {
			const query = encodeURIComponent(JSON.stringify({ username }));
			const lookupEndpoint = `${restDbConfig.baseUrl}/${restDbConfig.collection}?q=${query}`;
			const lookupResponse = await fetch(lookupEndpoint, {
				method: "GET",
				headers: {
					"x-apikey": restDbConfig.apiKey,
					"Content-Type": "application/json"
				}
			});

			if (!lookupResponse.ok) {
				throw new Error("Account lookup failed.");
			}

			const existing = await lookupResponse.json();
			if (Array.isArray(existing) && existing.length > 0) {
				if (messageEl) {
					messageEl.textContent = "That username is already taken.";
				}
				return;
			}

			const createEndpoint = `${restDbConfig.baseUrl}/${restDbConfig.collection}`;
			const createPayload = {
				username,
				password,
				has_voted: false,
				hasVoted: false,
				pfp: ""
			};

			const createResponse = await fetch(createEndpoint, {
				method: "POST",
				headers: {
					"x-apikey": restDbConfig.apiKey,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(createPayload)
			});

			if (!createResponse.ok) {
				throw new Error("Account creation failed.");
			}

			if (messageEl) {
				messageEl.textContent = "Account created. Redirecting to login...";
			}

			const redirectTo = registerForm.getAttribute("data-redirect") || "login.html";
			setTimeout(() => {
				window.location.href = redirectTo;
			}, 900);
		} catch (error) {
			if (messageEl) {
				messageEl.textContent = "Unable to create an account. Please try again.";
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

const initializeAccountPage = () => {
	const accountForm = document.querySelector("[data-account-form]");
	if (!accountForm) return;

	const authUser = sessionStorage.getItem("authUser");
	const avatarImg = document.querySelector("[data-account-avatar]");
	const fallbackEl = document.querySelector("[data-account-fallback]");
	const usernameEl = document.querySelector("[data-account-username]");
	const statusEl = document.querySelector("[data-account-status]");
	const guardEl = document.querySelector("[data-account-guard]");
	const fileInput = accountForm.querySelector("[data-account-file]");
	const saveButton = accountForm.querySelector("[data-account-save]");
	const imgbbKey = "3d5e806a3484cf0f4a3c278564ddc8fa";
	let cachedUser = null;

	const setStatus = (message, isError = false) => {
		if (!statusEl) return;
		statusEl.textContent = message;
		statusEl.classList.toggle("error", isError);
	};

	const setBusy = (isBusy) => {
		accountForm.classList.toggle("is-busy", isBusy);
		if (saveButton) saveButton.disabled = isBusy;
		if (fileInput) fileInput.disabled = isBusy;
	};

	const setAvatar = (url) => {
		if (avatarImg) {
			avatarImg.src = url || "";
			avatarImg.alt = authUser ? `${authUser} profile picture` : "Profile picture";
			avatarImg.style.display = url ? "block" : "none";
		}
		if (fallbackEl) {
			const initial = authUser ? authUser.charAt(0).toUpperCase() : "?";
			fallbackEl.textContent = initial || "?";
			fallbackEl.style.display = url ? "none" : "inline";
		}
	};

	const fetchUser = async () => {
		if (!authUser) return null;

		const query = encodeURIComponent(JSON.stringify({ username: authUser }));
		const endpoint = `${restDbConfig.baseUrl}/${restDbConfig.collection}?q=${query}`;

		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				"x-apikey": restDbConfig.apiKey,
				"Content-Type": "application/json"
			}
		});

		if (!response.ok) {
			throw new Error("Account lookup failed.");
		}

		const results = await response.json();
		if (Array.isArray(results) && results.length > 0) {
			return results[0];
		}

		const fallbackResponse = await fetch(
			`${restDbConfig.baseUrl}/${restDbConfig.collection}?max=1000`,
			{
				method: "GET",
				headers: {
					"x-apikey": restDbConfig.apiKey,
					"Content-Type": "application/json"
				}
			}
		);

		if (!fallbackResponse.ok) {
			throw new Error("Account lookup failed.");
		}

		const fallbackResults = await fallbackResponse.json();
		if (Array.isArray(fallbackResults)) {
			const match = fallbackResults.find((item) => {
				const usernameValue = String(item?.username || "").toLowerCase();
				return usernameValue === authUser.toLowerCase();
			});
			return match || null;
		}

		return null;
	};

	if (usernameEl) {
		usernameEl.textContent = authUser || "Guest";
	}

	setAvatar("");

	if (!authUser) {
		setStatus("Please log in to update your profile.", true);
		if (guardEl) {
			guardEl.classList.remove("hidden");
		}
		if (saveButton) saveButton.disabled = true;
		if (fileInput) fileInput.disabled = true;
		return;
	}

	if (guardEl) {
		guardEl.classList.add("hidden");
	}

	setStatus("Loading your profile...");
	fetchUser()
		.then((user) => {
			cachedUser = user;
			const pfpUrl = user?.pfp;
			setAvatar(pfpUrl || "");
			setStatus(pfpUrl ? "Profile loaded." : "No profile picture yet.");
		})
		.catch(() => {
			setStatus("Unable to load account details.", true);
		});

	if (fileInput) {
		fileInput.addEventListener("change", () => {
			const file = fileInput.files?.[0];
			if (!file) {
				setStatus("Choose an image to upload.", true);
				return;
			}
			const previewUrl = URL.createObjectURL(file);
			setAvatar(previewUrl);
			setStatus("Ready to upload.");
		});
	}

	accountForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const file = fileInput?.files?.[0];
		if (!file) {
			setStatus("Please choose an image file first.", true);
			return;
		}

		setBusy(true);
		setStatus("Uploading image...");

		try {
			const uploadData = new FormData();
			uploadData.append("image", file);

			const imgbbResponse = await fetch(
				`https://api.imgbb.com/1/upload?key=${imgbbKey}`,
				{
					method: "POST",
					body: uploadData
				}
			);

			const imgbbJson = await imgbbResponse.json().catch(() => null);
			if (!imgbbResponse.ok || !imgbbJson?.success) {
				const imgbbMessage = imgbbJson?.error?.message || "Image upload failed.";
				throw new Error(imgbbMessage);
			}
			const imageUrl = imgbbJson?.data?.url;
			if (!imageUrl) {
				throw new Error("Image URL missing.");
			}

			setStatus("Saving to your account...");
			const user = cachedUser || (await fetchUser());
			if (!user) {
				throw new Error(`Account not found for ${authUser}.`);
			}
			const recordId = user?._id || user?.id || user?._id?.$oid;
			if (!recordId) {
				throw new Error("Account record id missing.");
			}

			const updateEndpoint = `${restDbConfig.baseUrl}/${restDbConfig.collection}/${encodeURIComponent(recordId)}`;
			const updatePayload = { ...user, pfp: imageUrl };
			const updateResponse = await fetch(updateEndpoint, {
				method: "PUT",
				headers: {
					"x-apikey": restDbConfig.apiKey,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(updatePayload)
			});

			if (!updateResponse.ok) {
				const errorText = await updateResponse.text();
				const detail = errorText ? `Account update failed: ${errorText}` : "Account update failed.";
				throw new Error(detail);
			}

			cachedUser = updatePayload;
			setAvatar(imageUrl);
			setStatus("Profile picture updated.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to update profile picture.";
			setStatus(message, true);
		} finally {
			setBusy(false);
		}
	});
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
	initializeRegisterForm();
	updateLoginButton();
	initializeAccountPage();
});

window.addEventListener("pageshow", () => {
	// Ensure loader is hidden when returning via back/forward cache
	hideLoading();
});
