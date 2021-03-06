import { baseUrl } from "./settings/api.js";
import displayMessage from "./components/displayMessage.js";
import { saveToken, saveUser } from "./utils/storage.js";
import createMenu from "./components/createMenu.js";

localStorage.removeItem("token");
localStorage.removeItem("user");

createMenu();

const login = document.querySelector("form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const message = document.querySelector(".error-user");

login.addEventListener("submit", submitForm);

function submitForm(event) {
    event.preventDefault();

    message.innerHTML = "";

    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();

    if (usernameValue.length === 0 || passwordValue.length === 0) {
        return displayMessage("alert-danger", "Fill all inputs", ".error-user")
    }

    doLogin(usernameValue, passwordValue);
}

async function doLogin(username, password) {
    const url = baseUrl + "/auth/local";

    const data = JSON.stringify({ identifier: username, password: password });

    const options = {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, options);

        const json = await response.json();

        if (json.user) {
            saveToken(json.jwt);
            saveUser(json.user);

            location.href = "../admin.html";
        }

        if (json.error) {
            displayMessage("alert-danger", "Invalid login details", ".error-user");
        }

        console.log(json);
    } catch (error) {
        displayMessage("alert-danger", error, ".error-user");
    }
}