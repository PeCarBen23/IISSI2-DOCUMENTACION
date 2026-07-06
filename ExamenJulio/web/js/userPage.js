"use strict";

// 1. Importamos las APIs de TODAS las tablas involucradas
import { usersAPI_auto } from "./api/_users.js";
import { userhobbiesAPI_auto } from "./api/_userhobbies.js"; // Para saber qué ID de hobby tiene
import { hobbiesAPI_auto } from "./api/_hobbies.js";         // Para saber el nombre del hobby
import { commentsAPI_auto } from "./api/_comments.js";       // Para los comentarios
import { userPageRenderer } from "./renderers/userPageRenderer.js";
import { messageRenderer } from "./renderers/messages.js";

async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        messageRenderer.showErrorMessage("Error: No se ha especificado ningún usuario en la URL.");
        return;
    }

    try {
        // 2. Descargamos la información básica del usuario
        let user = await usersAPI_auto.getById(userId);

        // --- A) PINTAR LA TARJETA PRINCIPAL ---
        let contenedorPerfil = document.getElementById("profile-info");
        if (contenedorPerfil) {
            contenedorPerfil.innerHTML = "";
            contenedorPerfil.appendChild(userPageRenderer.asProfileCard(user));
        }

        // --- B) CRUZAR Y PINTAR LOS HOBBIES (Con bucles normales) ---
        let contenedorHobbies = document.getElementById("profile-hobbies");
        if (contenedorHobbies) {
            contenedorHobbies.innerHTML = "";
            
            // Pedimos todas las tablas de relaciones a la API
            let todosUserHobbies = await userhobbiesAPI_auto.getAll();
            let todosHobbies = await hobbiesAPI_auto.getAll();
            
            // Creamos una lista vacía para guardar solo los nombres que coincidan
            let hobbiesDelUsuario = [];

            // Bucle 1: Buscamos qué hobbyId pertenecen a este usuario en la tabla UserHobbies
            for (let relacion of todosUserHobbies) {
                if (relacion.userId == userId) {
                    
                    // Bucle 2: Ahora que tenemos el hobbyId, buscamos su nombre en la tabla Hobbies
                    for (let hobby of todosHobbies) {
                        if (hobby.hobbyId == relacion.hobbyId) {
                            hobbiesDelUsuario.push(hobby.name); // Guardamos el nombre (ej: "Senderismo")
                        }
                    }
                }
            }

            // Le pasamos al renderizador la lista que acabamos de llenar
            contenedorHobbies.appendChild(userPageRenderer.asHobbiesList(hobbiesDelUsuario));
        }

        // --- C) FILTRAR Y PINTAR LOS COMENTARIOS (Con bucle normal) ---
        let contenedorComentarios = document.getElementById("profile-comments");
        if (contenedorComentarios) {
            contenedorComentarios.innerHTML = "";
            
            let todosComentarios = await commentsAPI_auto.getAll();
            let comentariosEncontrados = 0;

            // Recorremos todos los comentarios y pintamos SOLO los dirigidos a este usuario (targetUserId)
            for (let comentario of todosComentarios) {
                if (comentario.targetUserId == userId) {
                    comentariosEncontrados = comentariosEncontrados + 1;
                    contenedorComentarios.appendChild(userPageRenderer.asComment(comentario));
                }
            }

            // Si el bucle terminó y no encontró ninguno, mostramos el mensaje vacío
            if (comentariosEncontrados === 0) {
                contenedorComentarios.innerHTML = "<p class='text-muted'>No hay comentarios en este perfil.</p>";
            }
        }

    } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
        messageRenderer.showErrorMessage("No se pudieron cargar los datos del usuario. Verifique el servidor.");
    }
}

document.addEventListener("DOMContentLoaded", main);