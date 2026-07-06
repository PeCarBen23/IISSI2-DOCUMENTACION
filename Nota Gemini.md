# GUÍA : 

## 🏛️ FASE 0: Análisis del Modelo de Datos (El Cimiento)

Cuando recibes el proyecto, **nunca toques el código JavaScript sin antes estudiar la base de datos**. Todo fallo posterior suele nacer de un descuadre de nombres aquí.

1.  Ejecuta ( `sql/createdb.sq`l y el `sql/populate.sql`).

## ⚙️ FASE 1: Configuración del Backend y Generación de la API (Silence)

El framework Silence se encarga de crear el servidor REST automáticamente a partir de tu base de datos.

1.  **Revisa** `**settings.py**`**:** Asegúrate de que `DB_CONN` apunta a tu base de datos y que `USER_AUTH_DATA` apunta a la tabla `Users`.
2.  **Ejecuta los comandos de terminal en orden:**
    
    *   `silence createdb`: Lee tu SQL y crea las tablas en MariaDB.
    *   `silence createapi`: Escanea la base de datos y autogenera la carpeta `js/api/` con los archivos de conexión (`_users.js`, `_pets.js`, `_adoptions.js`, etc.).
    *   `silence run`: Levanta el servidor en `http://localhost:8081/`.
    
    **Regla de Oro:** _Jamás modifiques los archivos que empiezan por un guion bajo (_`__pets.js_`_)_. Son autogenerados y se sobreescribirán si vuelves a ejecutar el comando.

## 🎨 FASE 2: Arquitectura del Frontend y Navegación

Preparamos el esqueleto visual para que el usuario pueda navegar por la aplicación y ver su estado de sesión.

1.  **El Menú Superior (**`**header.html**` **y** `**header.js**`**):**
    *   Contiene los enlaces de navegación (`index.html`, `login.html`, `createPet.html`).
    *   El controlador `header.js` utiliza `sessionManager.isLogged()` para **ocultar o mostrar botones dinámicamente** (si eres _Guest_, oculta "Crear Mascota" y "Logout"; si estás logueado, oculta "Login").
2.  **Importación universal en todos tus HTML:**
    
    En el `<head>` de tus páginas siempre deben estar las librerías base y tu controlador específico como módulo: 
    
    HTML
    
    ```
    <script src="js/libs/bootstrap.min.js"></script>
    <script src="js/libs/axios.min.js"></script>
    <script src="js/utils/include.js"></script>
    <script src="js/header.js" type="module"></script>
    <script src="js/index.js" type="module"></script>
    ```

## 🛡️ FASE 3: Autenticación (Registro y Login protegidos)

Implementamos el acceso de usuarios asegurando que nadie envíe datos corruptos al servidor.

1.  **El Validador Lógico (**`**js/validators/users.js**`**):**
    
    Evalúa los campos extraídos con `formData.get(...)` antes de tocar la red:
    
    JavaScript
    
    ```
    "use strict";
    const userValidator = {
      validateRegister: function (formData) {
        let errors = [];
        let username = formData.get("username");
        let age = parseFloat(formData.get("age"));
    
        if (!username || username.trim().length < 4) {
          errors.push("El usuario debe tener al menos 4 caracteres.");
        }
        if (isNaN(age) || age < 18) {
          errors.push("Debes ser mayor de edad para gestionar adopciones.");
        }
        return errors;
      }
    };
    export { userValidator };
    
    ```
2.  **El Controlador del Registro (**`**js/register.js**`**):**
    
    Aplica el patrón de **Barrera de Validación**:
    
    JavaScript
    
    ```
    function handleSubmitRegister(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        sendRegister(formData);
    }
    async function sendRegister(formData) {
        const errors = userValidator.validateRegister(formData);
        if (errors.length > 0) {
            for (let error of errors) messageRenderer.showErrorMessage(error);
        } else {
            try {
                let registerData = await authAPI_auto.register(formData);
                sessionManager.register(registerData.sessionToken, registerData.user);
                window.location.href = "index.html";
            } catch (error) {
                messageRenderer.showErrorMessage(error.response.data.message);
            }
        }
    }
    ```

## 📋 FASE 4: Tablón Principal (Lectura y Renderizado - `GET`)

Mostramos el listado público de entidades en la portada (`index.html`).

1.  **El Renderizador (**`**js/renderers/petRenderer.js**`**):**
    
    Diseña el HTML de cada tarjeta inyectando variables dinámicas y preparando el enlace para el detalle:
    
    JavaScript
    
    ```
    "use strict";
    import { parseHTML } from "/js/utils/parseHTML.js";
    
    const petRenderer = {
      asCard: function (pet) {
        let html = `<div class="col-md-4 mb-3">
          <div class="card shadow-sm" id="pet-${pet.petId}">
            <div class="card-body">
              <h4 class="card-title">${pet.name}</h4>
              <p class="card-text">Especie: ${pet.species} | Edad: ${pet.age} años</p>
              <a href="petDetail.html?id=${pet.petId}" class="btn btn-outline-primary">Ver Ficha</a>
            </div>
          </div>
        </div>`;
        return parseHTML(html);
      }
    };
    export { petRenderer };
    
    ```
2.  **El Orquestador de la Portada (**`**js/index.js**`**):**
    
    Descarga las mascotas desde la API y las apila en el contenedor con blindaje de seguridad:
    
    JavaScript
    
    ```
    async function loadPets() {
        try {
            let pets = await petsAPI_auto.getAll();
            let container = document.getElementById("pets-container");
            if (!container) return; // Blindaje por si el HTML no tiene el ID
    
            container.innerHTML = "";
            for (let pet of pets) {
                container.appendChild(petRenderer.asCard(pet));
            }
        } catch (err) {
            messageRenderer.showErrorMessage("Error al cargar las mascotas.");
        }
    }
    
    ```

## 📝 FASE 5: Creación Protegida + Reglas de Negocio (`POST`)

Permitimos añadir una nueva mascota (`createPet.html`), garantizando que solo los usuarios logueados puedan hacerlo y aplicando restricciones lógicas de examen.

1.  **El HTML Espejo (**`**createPet.html**`**):**
    
    Cada `<input>` **debe tener un atributo** `**name**` **exactamente igual a la columna de SQL**:
    
    HTML
    
    ```
    <input type="text" class="form-control" name="name" required>
    <input type="number" class="form-control" name="age" required min="0">
    
    ```
2.  **El Validador de Negocio (**`**js/validators/createPetValidator.js**`**):**
    
    Aquí se implementan las restricciones que pide el profesor en el enunciado:
    
    JavaScript
    
    ```
    "use strict";
    const petValidator = {
      validateEvent: function (formData) {
        let errors = [];
        let name = formData.get("name");
        let species = formData.get("species");
        let age = parseFloat(formData.get("age"));
    
        // Restricción 1: Comparación entre dos atributos de texto
        if (name && species && name.trim().toLowerCase() === species.trim().toLowerCase()) {
          errors.push("El nombre de la mascota no puede ser igual a su especie.");
        }
        // Restricción 2: Rango numérico estricto
        if (isNaN(age) || age < 0 || age > 30) {
          errors.push("La edad debe ser un número real entre 0 y 30 años.");
        }
        return errors;
      }
    };
    export { petValidator };
    
    ```
3.  **El Controlador Conectado (**`**js/createPet.js**`**):**
    
    Comprueba la sesión e inyecta los metadatos ocultos del sistema:
    
    JavaScript
    
    ```
    const userId = sessionManager.getLoggedId();
    
    async function main() {
        // Barrera de seguridad para usuarios anónimos (Guest)
        if (userId === null) {
            messageRenderer.showErrorMessage("Debes iniciar sesión para publicar un animal.");
            document.querySelector("button[type='submit']").disabled = true;
            return;
          }
        document.getElementById("form-create").onsubmit = handleSubmitForm;
    }
    
    async function handleSubmitForm(event) {
        event.preventDefault();
        document.getElementById("errors").innerHTML = "";
    
        let formData = new FormData(event.target);
        // INYECCIÓN DE SISTEMA: Aportamos el ID del refugio logueado y el estado por defecto
        formData.append("shelterId", userId);
        formData.append("status", "disponible");
    
        const errors = petValidator.validateEvent(formData);
        if (errors.length > 0) {
            for (let error of errors) messageRenderer.showErrorMessage(error);
        } else {
            try {
                await petsAPI_auto.create(formData);
                window.location.href = "index.html";
            } catch (err) {
                messageRenderer.showErrorMessage(err.response?.data?.message || "Error fatal.");
            }
        }
    }
    
    ```

## 🔍 FASE 6: Patrón Maestro-Detalle y Cruce Relacional en Cliente (`GET` Avanzado)

La última funcionalidad del proyecto: al hacer clic en "Ver Ficha" en la portada, viajamos a `petDetail.html?id=X` para ver a la mascota junto con sus solicitudes de adopción y notas veterinarias cruzando varias tablas en el frontend.

1.  **La Carátula Vacía (**`**petDetail.html**`**):**
    
    Dejamos las cajas identificadas esperando la inyección:
    
    HTML
    
    ```
    <div id="pet-info"></div>
    <h3 class="mt-4">Solicitudes de Adopción</h3>
    <div id="pet-adoptions"></div>
    
    ```
2.  **El Controlador de Cruce Relacional (**`**js/petDetail.js**`**):**
    
    Captura la URL, descarga múltiples tablas y las filtra usando bucles tradicionales:
    
    JavaScript
    
    ```
    async function main() {
        // 1. Extraer parámetro '?id=' de la barra de direcciones
        const urlParams = new URLSearchParams(window.location.search);
        const petId = urlParams.get("id");
        if (!petId) return;
    
        try {
            // 2. Descargar la entidad principal
            let pet = await petsAPI_auto.getById(petId);
            document.getElementById("pet-info").appendChild(petRenderer.asDetailCard(pet));
    
            // 3. CRUCE RELACIONAL: Descargar solicitudes y filtrar las de esta mascota
            let allAdoptions = await adoptionsAPI_auto.getAll();
            let adoptionsContainer = document.getElementById("pet-adoptions");
            adoptionsContainer.innerHTML = "";
    
            let contador = 0;
            for (let adop of allAdoptions) {
                if (adop.petId == petId) { // Coincidencia de clave foránea
                    contador++;
                    adoptionsContainer.appendChild(petRenderer.asAdoptionRow(adop));
                }
            }
    
            if (contador === 0) {
                adoptionsContainer.innerHTML = "<p class='text-muted'>No hay solicitudes aún.</p>";
            }
        } catch (err) {
            messageRenderer.showErrorMessage("Error cargando la ficha de la mascota.");
        }
    }
    
    ```

# 📊 RESUMEN FINAL: RESULTADOS Y FÓRMULAS UTILIZADAS

Tal y como establecen tus directrices de aprendizaje, a continuación se presenta la tabla de resultados finales de la arquitectura y el prontuario con las **fórmulas exactas de programación** empleadas durante el ciclo de vida del proyecto.

### 1\. Tabla de Resultados de la Arquitectura del Proyecto

| **Fase / Componente** | **Archivo Clave** | **Resultado / Comportamiento Logrado** |
| --- | --- | --- |
| **API Backend** | `_pets.js`, `_users.js` | Conexión REST asíncrona automatizada y enrutada hacia MariaDB mediante Silence y Axios. |
| **Control de Sesión** | `sessionManager` (`session.js`) | Persistencia del token del usuario (`userId`) y renderizado condicional del menú de navegación. |
| **Tablón Público** | `index.js` + `petRenderer.js` | Renderizado dinámico del listado de entidades en tarjetas Bootstrap mediante DOM. |
| **Validación Lógica** | `petValidator.js` | Bloqueo preventivo en cliente ante violaciones de negocio (rangos numéricos, igualdad de cadenas) antes del `POST`. |
| **Maestro-Detalle** | `petDetail.js` (`URLSearchParams`) | Enrutamiento paramétrico (`?id=X`) y filtrado relacional en cliente mediante cruce de tablas 1:N. |

### 2\. Prontuario de Fórmulas y Patrones de JavaScript / DOM

#### 1\. Fórmula de Extracción de Parámetros URL (Query String)

Se utiliza para leer datos transmitidos entre páginas a través de la barra de direcciones:

$$\\text{urlParams} = \\text{new URLSearchParams(window.location.search)}$$

$$\\text{idCapturado} = \\text{urlParams.get("id")}$$

#### 2\. Fórmula de Extracción de Datos de Formulario

Permite obtener el valor en texto plano que el usuario ha introducido en pantalla, referenciando el atributo `name` del `<input>`:

$$\\text{formData} = \\text{new FormData(event.target)}$$

$$\\text{valorTexto} = \\text{formData.get("nombre\\\_columna\\\_sql")}$$

#### 3\. Fórmula de Conversión y Análisis Numérico (`parseFloat`)

Imprescindible para convertir cadenas de texto del formulario en números y poder evaluar rangos matemáticos ($\<, \>, \\le, \\ge$):

$$\\text{edad} = \\text{parseFloat(formData.get("age"))}$$

$$\\text{esInválido} = \\text{isNaN(edad)} \\lor (\\text{edad} \< 0) \\lor (\\text{edad} \> 30)$$

#### 4\. Fórmula de Inyección de Metadatos del Sistema (`append`)

Se utiliza para adjuntar variables ocultas (como el ID del usuario en sesión o fechas por defecto) al paquete que se enviará a la base de datos sin duplicar campos del HTML:

$$\\text{formData.append("columna\\\_sql\\\_sistema", userId)}$$

#### 5\. Fórmula de Barrera de Validación Preventiva

Patrón condicional que aborta la llamada a la API si el array de excepciones contiene elementos:

$$\\text{if } (\\text{errors.length} > 0) \\implies \\text{messageRenderer.showErrorMessage(error)}$$

$$\\text{else } \\implies \\text{await api.create(formData)}$$

#### 6\. Algoritmo de Cruce Relacional en Cliente (1 a N)

Fórmula de filtrado para emular un `JOIN` de SQL cuando se descargan tablas independientes en el frontend:

$$\\forall \\, \\text{item} \\in \\text{TablaDetalle}: \\quad \\text{if } (\\text{item.claveForanea} == \\text{idPrincipal}) \\implies \\text{renderizar(item)}$$