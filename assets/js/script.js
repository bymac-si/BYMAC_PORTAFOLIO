// js/script.js
$(document).ready(function () {

  // VALIDACIÓN CON jQUERY
  $("#form-contacto").on("submit", function (event) {
    event.preventDefault();

    const nombre  = $("#nombre").val().trim();
    const email   = $("#email").val().trim();
    const mensaje = $("#mensaje").val().trim();

    $("#mensaje-estado").html("");

    if (nombre === "" || email === "" || mensaje === "") {
      $("#mensaje-estado")
        .html("Por favor completa todos los campos.")
        .css("color", "red");
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      $("#mensaje-estado")
        .html("Por favor ingresa un correo válido.")
        .css("color", "red");
      return;
    }

    $("#mensaje-estado")
      .html("¡Gracias por contactarme! Te responderé pronto.")
      .css("color", "green");

    $("#form-contacto")[0].reset();
  });

  // SMOOTH SCROLL EN NAVBAR
  $("nav a[href^='#']").on("click", function (event) {
    event.preventDefault();

    const destino = $(this).attr("href");
    const $objetivo = $(destino);

    if ($objetivo.length) {
      $("html, body").animate(
        {
          scrollTop: $objetivo.offset().top
        },
        600
      );
    }
  });

});