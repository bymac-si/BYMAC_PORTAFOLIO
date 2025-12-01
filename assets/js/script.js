
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const errorAlert = document.getElementById("errorAlert");
  const successModalEl = document.getElementById("successModal");
  const successModal = new bootstrap.Modal(successModalEl);

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío real del formulario

    // Obtener valores
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // Validación básica
    let esValido = true;

    if (nombre === "" || email === "" || mensaje === "") {
      esValido = false;
    }

    // Validación simple de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      esValido = false;
    }

    if (!esValido) {
      // Mostrar alerta de error
      errorAlert.classList.remove("d-none");
      return;
    }

    // Si el formulario es válido:
    errorAlert.classList.add("d-none"); // Ocultar error si estaba visible

    // Limpiar formulario
    form.reset();

    // Mostrar el modal de éxito
    successModal.show();
  });
});