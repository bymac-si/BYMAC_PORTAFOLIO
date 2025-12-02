// 🛠️ E2-M3: Gestor Interactivo de Lista de Tareas
// Autor: Marcos Castro Abarca

// 1️⃣ Inicialización del arreglo vacío
let listaDeTareas = [];
let agregarOtra = true; // variable de control del bucle

console.log("📝 Bienvenido al Gestor Interactivo de Tareas");

// 2️⃣ Bucle para añadir tareas
while (agregarOtra) {
  let tarea = prompt("Ingresa una nueva tarea:");

  // Validación: no permitir tareas vacías
  if (!tarea || tarea.trim() === "") {
    console.log("⚠️ Error: La tarea no puede estar vacía.");
  } else {
    listaDeTareas.push(tarea.trim());
    console.log(`✅ Tarea agregada: "${tarea.trim()}"`);
  }

  // Preguntar si desea agregar otra tarea
  agregarOtra = confirm("¿Deseas agregar otra tarea?");
}

// 3️⃣ Mostrar la lista final
console.log("\n--- Lista de Tareas Pendientes ---");

if (listaDeTareas.length === 0) {
  console.log("No hay tareas pendientes. 🎉");
} else {
  for (let i = 0; i < listaDeTareas.length; i++) {
    console.log(`${i + 1}. ${listaDeTareas[i]}`);
  }
}

console.log("\n📋 Fin del programa. ¡Buena suerte con tus tareas!");