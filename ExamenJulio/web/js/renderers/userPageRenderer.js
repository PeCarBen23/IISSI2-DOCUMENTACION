"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const userPageRenderer = {
  asProfileCard: function (user) {
    let html = `<div class="card shadow-sm mb-4">
      <div class="card-body">
        <h3 class="card-title text-primary">${user.fullName}</h3>
        <h6 class="card-subtitle mb-2 text-muted">@${user.username}</h6>
        <p class="card-text mt-3">
          <strong>Edad:</strong> ${user.age} años<br>
          <strong>Ciudad:</strong> ${user.city || "No especificada"}
        </p>
      </div>
    </div>`;
    return parseHTML(html);
  },

asHobbiesList: function (hobbies) {
    if (!hobbies || hobbies.length === 0) {
      let htmlVacio = `<p class="text-muted">Este usuario no tiene hobbies.</p>`;
      return parseHTML(htmlVacio);
    }

    let listaHTML = "";
    
    for (let hobby of hobbies) {
      let nombreHobby = hobby;

      // Si el hobby viene como un objeto de BD (ej: { id: 1, name: "Fútbol" }), sacamos solo el nombre
      if (typeof hobby === "object") {
        nombreHobby = hobby.name;
      }

      listaHTML = listaHTML + `<span class="badge bg-info text-dark me-2 mb-2 p-2">${nombreHobby}</span>`;
    }

    // Metemos todas las etiquetas acumuladas dentro de un div contenedor
    let htmlFinal = `<div class="hobbies-container mb-4">${listaHTML}</div>`;
    return parseHTML(htmlFinal);
  },


  asComment: function (comment) {
    // Si authorUserId tiene un número ponemos su ID, si es NULL ponemos "Anónimo"
    let nombreAutor = "Anónimo";
    if (comment.authorUserId) {
        nombreAutor = "Usuario #" + comment.authorUserId;
    }

    let html = `<div class="card mb-2 border-light bg-light" id="comment-${comment.commentId}">
      <div class="card-body py-2 px-3">
        <div class="d-flex justify-content-between">
          <strong class="text-dark">${nombreAutor} comentó:</strong>
          <small class="text-muted">${comment.createdAt}</small>
        </div>
        <p class="mb-0 mt-1">${comment.commentText}</p>
      </div>
    </div>`;
    
    return parseHTML(html);
  }
};

export { userPageRenderer };