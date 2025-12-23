// ===============================
// Selección de Elementos
// ===============================
const imagenPrincipal = document.querySelector("#imagen-principal");
const contenedorPrincipal = document.querySelector("#imagen-principal-container");
const thumbnails = document.querySelectorAll(".thumbnail");

// ===============================
// Añadir Event Listeners
// ===============================
thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", () => {
    
    // ===============================
    // Lógica del Evento
    // ===============================
    const nuevaImagen = thumbnail.src;
    const descripcion = thumbnail.alt;

    // Actualizar imagen principal
    imagenPrincipal.src = nuevaImagen;

    // ===============================
    // Manejo del Pie de Foto
    // ===============================

    // Eliminar pie de foto anterior si existe
    const pieExistente = document.querySelector("#pie-de-foto");
    if (pieExistente) {
      pieExistente.remove();
    }

    // Crear nuevo pie de foto
    const pieDeFoto = document.createElement("p");
    pieDeFoto.id = "pie-de-foto";
    pieDeFoto.textContent = descripcion;

    // Añadir pie de foto al contenedor
    contenedorPrincipal.appendChild(pieDeFoto);
  });
});