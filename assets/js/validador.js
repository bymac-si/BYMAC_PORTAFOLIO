// 🛠️ E1-M3: Validador de Formulario Básico

// 1️⃣ Captura de datos con prompt()
let nombre = prompt("Ingresa tu nombre completo:");
let email = prompt("Ingresa tu correo electrónico:");
let password = prompt("Crea una contraseña (mínimo 8 caracteres):");

// 2️⃣ Proceso de validación
if (!nombre || nombre.trim() === "") {
  console.log("❌ Error: El campo 'nombre' no puede estar vacío.");
} else if (!email || email.trim() === "") {
  console.log("❌ Error: El campo 'correo electrónico' no puede estar vacío.");
} else if (!password || password.trim() === "") {
  console.log("❌ Error: El campo 'contraseña' no puede estar vacío.");
} else if (password.length < 8) {
  console.log("❌ Error: La contraseña debe tener al menos 8 caracteres.");
} else {
  console.log(`✅ Registro exitoso. ¡Bienvenido, ${nombre}!`);
}