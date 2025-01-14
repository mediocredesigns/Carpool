window.onload = function () {
	if (localStorage.authToken == null) {
		alert("You are not logged in");
		window.location.href = "/";
	} else {
		console.log(localStorage.authToken);
		toggleButtons();
		getUser();
	}
};

let orglat, orglng, orgTitle;

async function getUser() {
	fetch("https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/auth/me", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: localStorage.authToken,
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			console.log("data", data); // Do something with the response data
			let orgFilter = data.UserOrgName;
			orglat = data._organization.orgLat;
			orglng = data._organization.orgLng;
			orgTitle = data._organization.OrgName;
			orgTitle = orgTitle[0].toUpperCase() + orgTitle.slice(1);
			document.getElementById("orgTitle").innerText = orgTitle;
			// console.log(orgLat, orgLng);
			getUsers(orgFilter);
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
}

// Replace 'yourOrgName' with the actual orgName
function getUsers(orgFilter) {
	fetch(
		`https://x8ki-letl-twmt.n7.xano.io/api:BEPCmi3D/user?orgName=${orgFilter}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			console.log(data);
			loadMap(data);
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
		});
}

function loadMap(users) {
	///////////////////////////////////////////////////////
	const map = L.map("map").setView([orglat, orglng], 12);
	console.log(map);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);
	// L.Control.geocoder().addTo(map);

	const schoolIcon = L.icon({
		iconUrl:
			"https://img.icons8.com/fluency-systems-filled/512/school-building.png",
		iconSize: [30, 30],
		iconAnchor: [15, 15],
	});

	const layer = L.marker([orglat, orglng], {
		icon: schoolIcon,
	}).addTo(map);
	layer.bindPopup(`This is ${orgTitle}!`).openPopup();

	users.forEach((item) => {
		const { name, lat, lng, email, phone, preference } = item;
		const newMaker = L.marker([lat, lng], {
			title: name,
			riseOnHover: true,
		}).addTo(map);

		let phoneInsert = phone ? `<b>Phone:</b> ${phone}<br>` : "";

		let emailInsert = email ? `<b>Email:</b> ${email}<br>` : "";

		popUpinsert = `<b>Family:</b> ${name}<br>
			${emailInsert}
			${phoneInsert}
			<br>
			<b>Preference:</b><br> ${preference}`;

		newMaker.addTo(map).bindPopup(popUpinsert);
	});
}

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
