"use strict";

const userValidator = {
  // 1. Corregimos el parámetro de entrada a 'formData'
  validateRegister: function (formData) {
    let errors = [];
    
    // 2. Extraemos los valores con .get() usando el parámetro 'formData'
    let fullName = formData.get("fullName");
    let username = formData.get("username");
    let city = formData.get("city");
    let age = parseFloat(formData.get("age"));

    // 3. Evaluamos directamente las variables extraídas (sin puntos ni userValidator)
    if (!fullName || fullName.trim().length < 3) {
      errors.push("El nombre completo debe tener al menos 3 caracteres.");
    }
    
    if (!username || username.trim().length < 3) {
      errors.push("El nombre de usuario debe tener al menos 3 caracteres.");
    }
    
    if (!city || city.trim().length < 3) {
      errors.push("El nombre de su ciudad debe tener al menos 3 caracteres.");
    }
    
    if (isNaN(age) || age < 16) {
      errors.push("Debe de ser mayor de 16 años para crear un usuario");
    }
    
    return errors;
  },
};

export { userValidator };