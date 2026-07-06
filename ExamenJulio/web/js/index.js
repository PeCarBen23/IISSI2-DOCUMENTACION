"use strict";
import { usersAPI_auto } from "./api/_users.js";
import { usersRenderer } from "./renderers/users.js";
import { messageRenderer } from "./renderers/messages.js";

async function loadUsers() {
    try {
        let users = await usersAPI_auto.getAll();
        let usersContainer = document.getElementById("users");
        for (let user of users) {
            usersContainer.appendChild(usersRenderer.asLine(user));
        }
    } catch (error) {
        console.error("Error cargando usuarios:", error);
        messageRenderer.showErrorMessage("Error cargando usuarios: " + error);
    }
}

function main() {
    loadUsers();
}

document.addEventListener("DOMContentLoaded", main);