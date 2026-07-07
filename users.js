"use strict";

const userValidator = {
  validate: function (user) {
    let errors = [];
    if (user.username.length < 3) {
      errors.push("El nombre de usuario debe tener al menos 3 caracteres.");
    }

    return errors;
  },
};

export { userValidator };
