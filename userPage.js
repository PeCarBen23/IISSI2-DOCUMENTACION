"use strict";

import { messageRenderer } from "./renderers/messages.js";
import { userPageRenderer } from "./renderers/userPage.js";
import { usersAPI_auto } from "./api/_users.js";
import { userhobbiesAPI_auto } from "./api/_userhobbies.js";
import { commentsAPI_auto } from "./api/_comments.js";

async function loadUser(userId) {
    try {
        let user = await usersAPI_auto.getById(userId);
        let container = document.getElementById("user-info");
        container.appendChild(userPageRenderer.asUserCard(user));
    } catch (error) {
        console.error("Error cargando usuario:", error);
        messageRenderer.showErrorMessage("Error cargando el usuario: " + error);
    }
}

async function loadHobbies(userId) {
    try {
        let allUserHobbies = await userhobbiesAPI_auto.getAll();
        let container = document.getElementById("user-hobbies");
        
        container.innerHTML = "<h3 class='text-secondary border-bottom pb-2'>Hobbies</h3><ul class='list-group my-2' id='hobbies-list'></ul>";
        let listContainer = document.getElementById("hobbies-list");

        let encontrados = 0;
        for (let hobby of allUserHobbies) {
            // SOLUCIONADO: Filtrado manual en el cliente por userId
            if (hobby.userId == userId) {
                listContainer.appendChild(userPageRenderer.asHobbyLine(hobby));
                encontrados++;
            }
        }
        
        if (encontrados === 0) {
            listContainer.innerHTML = "<li class='list-group-item text-muted'>Este usuario no tiene hobbies registrados.</li>";
        }
    } catch (error) {
        console.error("Error cargando hobbies:", error);
        messageRenderer.showErrorMessage("Error cargando hobbies: " + error);
    }
}

async function loadComments(userId) {
    try {
        let allComments = await commentsAPI_auto.getAll();
        let container = document.getElementById("user-comments");
        
        container.innerHTML = "<h3 class='text-secondary border-bottom pb-2'>Comentarios Recibidos</h3><div id='comments-list' class='my-2'></div>";
        let listContainer = document.getElementById("comments-list");

        let encontrados = 0;
        for (let comment of allComments) {
            // SOLUCIONADO: Filtrado manual en el cliente por targetUserId
            if (comment.targetUserId == userId) {
                listContainer.appendChild(userPageRenderer.asCommentCard(comment));
                encontrados++;
            }
        }
        
        if (encontrados === 0) {
            listContainer.innerHTML = "<p class='text-muted'>No hay comentarios para este usuario.</p>";
        }
    } catch (error) {
        console.error("Error cargando comentarios:", error);
        messageRenderer.showErrorMessage("Error cargando comentarios: " + error);
    }
}

function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    if (!userId) {
        messageRenderer.showErrorMessage("No se ha especificado ningún ID de usuario en la URL.");
        return;
    }

    loadUser(userId);
    loadHobbies(userId);
    loadComments(userId);
}

document.addEventListener("DOMContentLoaded", main);