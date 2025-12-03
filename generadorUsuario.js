// Generador de Nombres de Usuario (versión Node.js)
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ingresa tu nombre: ", (nombre) => {
  rl.question("Ingresa tu apellido: ", (apellido) => {
    if (!nombre || !apellido || nombre.trim() === "" || apellido.trim() === "") {
      console.log("❌ Error: Debes ingresar un nombre y un apellido válidos.");
    } else {
      const inicialNombre = nombre.slice(0, 1).toLowerCase();
      const parteApellido = apellido.slice(0, 3).toLowerCase();
      const numeroAleatorio = Math.floor(Math.random() * 90) + 10;
      const nombreUsuario = inicialNombre + parteApellido + numeroAleatorio;

      console.log(`🤖 Tu nuevo nombre de usuario es: ${nombreUsuario}`);
    }
    rl.close();
  });
});