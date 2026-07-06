"use strict";

import { authAPI_auto } from "/js/api/_auth.js";
import { sessionManager } from "/js/utils/session.js";
import { messageRenderer } from "/js/renderers/messages.js";
import {userValidator} from "/js/validators/users.js";

// DOM elements that we will use
const registerForm = document.getElementById("register-form");
const errorsDiv = document.getElementById("errors");

async function main() { // Main function that will run when the page is ready
    registerForm.onsubmit = handleSubmitRegister;    // Handle the form's submit event
}
///////////////////////////////////////////////////////////////////////////////

function handleSubmitRegister(event) {
    event.preventDefault();    // Prevent the browser from sending the form
    if (errorsDiv) errorsDiv.innerHTML = ""; 
    //Creamos el paquete de datos a partir del formulario
    let formData = new FormData(registerForm);
    //Le pasamos los datos a la función encargada de gestionar el envío
    sendRegister(formData);
}

async function sendRegister(formData) {
const errors = userValidator.validateRegister(formData); //Aqui actua el users.js
if (errors.length > 0) {
        // Si hay errores, los mostramos con el renderizador de mensajes y cortamos
        for (let error of errors) {
            messageRenderer.showErrorMessage(error);
        }
    } else {
        try { // If the register is successful, store the session token and the logged user data
            let registerData = await authAPI_auto.register(formData);
            sessionManager.register(registerData.sessionToken, registerData.user);
            window.location.href = "index.html"; // Navigate to main page
        } catch (error) {
            messageRenderer.showErrorMessage(error.response.data.message); // If there is an error, access the mesage in the response and show it to the user
        }
    }
}
////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", main);