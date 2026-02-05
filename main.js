const hideLoading = () => {
	const loadingScreen = document.getElementById("loading-screen");
	if (loadingScreen) {
		loadingScreen.classList.add("hidden");
	}

	document.body.classList.remove("is-loading");
};

window.addEventListener("load", () => {
	const hasLoadedOnce = sessionStorage.getItem("hasLoadedOnce");

	if (hasLoadedOnce) {
		hideLoading();
	} else {
		sessionStorage.setItem("hasLoadedOnce", "true");
		setTimeout(hideLoading, 1500);
	}
});

window.addEventListener("pageshow", () => {
	// Ensure loader is hidden when returning via back/forward cache
	hideLoading();
});
