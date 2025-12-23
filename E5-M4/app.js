// ===============================
// Selección de elementos
// ===============================
const btnCargarXHR = document.getElementById("cargar-xhr");
const btnCargarFetch = document.getElementById("cargar-fetch");
const resultado = document.getElementById("resultado");

const URL_USUARIOS = "https://jsonplaceholder.typicode.com/users";

// ===============================
// Función común: Renderizar usuarios
// ===============================
const renderizarUsuarios = (usuarios) => {
  // Limpia el contenido previo
  resultado.innerHTML = "";

  // Crea contenedor UL
  const ul = document.createElement("ul");

  usuarios.forEach((user) => {
    const li = document.createElement("li");

    const nombre = document.createElement("h4");
    nombre.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = user.email;

    li.appendChild(nombre);
    li.appendChild(email);
    ul.appendChild(li);
  });

  resultado.appendChild(ul);
};

// ===============================
// Parte 1: XHR (método clásico)
// ===============================
btnCargarXHR.addEventListener("click", () => {
  // Mensaje de carga (opcional)
  resultado.textContent = "Cargando usuarios (XHR)...";

  const xhr = new XMLHttpRequest();

  xhr.open("GET", URL_USUARIOS, true);

  xhr.onload = function () {
    if (this.status === 200) {
      const usuarios = JSON.parse(this.responseText);
      renderizarUsuarios(usuarios);
    } else {
      console.error("Error XHR. Status:", this.status);
      resultado.textContent = `Error al cargar usuarios (XHR). Status: ${this.status}`;
    }
  };

  xhr.onerror = function () {
    console.error("Error de red en XHR");
    resultado.textContent = "Error de red al cargar usuarios (XHR).";
  };

  xhr.send();
});

// ===============================
// Parte 2: Fetch (método moderno)
// ===============================
btnCargarFetch.addEventListener("click", () => {
  // Mensaje de carga (opcional)
  resultado.textContent = "Cargando usuarios (Fetch)...";

  fetch(URL_USUARIOS)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((usuarios) => {
      renderizarUsuarios(usuarios);
    })
    .catch((error) => {
      console.error("Error Fetch:", error);
      resultado.textContent = `Error al cargar usuarios (Fetch): ${error.message}`;
    });
});