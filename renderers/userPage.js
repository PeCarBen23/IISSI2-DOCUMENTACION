"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const userPageRenderer = {
  asUserCard: function (user) {
    let html = `<div class="card my-3 p-4 shadow-sm">
        <div class="row align-items-center">
            <div class="col-md-3 text-center">
                <img src="${user.avatarUrl}" class="img-fluid rounded-circle" alt="Avatar" style="max-width: 120px;">
            </div>
            <div class="col-md-9">
                <h2 class="text-primary">${user.fullName} (<small class="text-muted">@${user.username}</small>)</h2>
                <hr>
                <p class="mb-1"><strong>ID:</strong> #${user.userId} | <strong>Ciudad:</strong> ${user.city} | <strong>Edad:</strong> ${user.age} años</p>
            </div>
        </div>
    </div>`;
    return parseHTML(html);
  },

    asHobbyLine: function (userHobby) {
    let nombreHobby = userHobby.name ? userHobby.name : `Hobby #${userHobby.hobbyId}`;
    let html = `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${nombreHobby}
        <span class="badge bg-primary rounded-pill">Afinidad: ${userHobby.affinity}/5</span>
    </li>`;
    return parseHTML(html);
  },
    asCommentCard: function (comment) {
    let html = `<div class="card mb-2">
        <div class="card-body">
            <p class="card-text">${comment.commentText}</p>
            <small class="text-muted">Fecha: ${comment.createdAt}</small>
        </div>
    </div>`;
    return parseHTML(html);
  }
};
export { userPageRenderer };