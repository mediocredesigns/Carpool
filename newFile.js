document.addEventListener("DOMContentLoaded", function () {
	if (localStorage.authToken == null) {
		console.log("No user");
	} else {
		console.log("User Found");
		toggleButtons();
	}

	document
		.getElementById("userForm")
		.addEventListener("submit", function (event) {
			event.preventDefault(); // Prevent the default form submission
			if (localStorage.authToken) {
				alert("You are already logged in!");
				window.location.href = "/my-profile";
			}
			const formData = {
				name: document.getElementById("name").value,
				email: document.getElementById("email").value,
				password: document.getElementById("password").value,
				orgName: document.getElementById("school").value,
				orgKey: document.getElementById("schoolKey").value,
				// UserOrgName: document.getElementById("school").value,
			};

			fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then((response) => {
					console.log("response", response);
					if (response.ok) {
						return response.json();
					} else {
						alert(
							"Request not completed - make sure password has both letters and numbers."
						);
						throw new Error("Something went wrong with the request.");
					}
				})
				.then((data) => {
					if (!data) {
						console.log("NULL DATA");
						alert("Organization and/or Passkey are incorrect");
					} else {
						const xanoResponse = data;
						console.log("xanoResponse", xanoResponse);
						const authToken = xanoResponse.authToken;
						localStorage.setItem("authToken", authToken);
						document.getElementById("userForm").reset();
						window.location.href = "/my-profile";
					}
				})
				.catch((error) => console.error("Error:", error));
		});

	document
		.getElementById("login-form")
		.addEventListener("submit", function (event) {
			event.preventDefault(); // Prevent the form from submitting normally

			// Get form data
			const formData = new FormData(event.target);
			const email = formData.get("login-email");
			const password = formData.get("login-password");

			// Construct the request body
			const requestBody = {
				email: email,
				password: password,
			};

			console.log(requestBody);

			// Make the fetch request
			fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					const xanoResponse = data;
					const authToken = xanoResponse.authToken;
					localStorage.setItem("authToken", authToken);
					toggleButtons();
					document.getElementById("login-modal").style.display = "none";
				})
				.catch((error) => {
					// Handle errors
					console.error("There was a problem with the fetch operation:", error);
				});
		});

	function toggleButtons() {
		const signUp_button = document.getElementById("sign-up_button");
		const logIn_button = document.getElementById("log-in_button");
		const myProfile_button = document.getElementById("my-profile_button");
		const app_button = document.getElementById("app_button");

		signUp_button.classList.toggle("hide");
		logIn_button.classList.toggle("hide");
		myProfile_button.classList.toggle("hide");
		app_button.classList.toggle("hide");
	}
});
