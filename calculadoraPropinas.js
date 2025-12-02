// 🛠️ E3-M3: Calculadora de Propinas Modular 🧮
// Autor: Marcos Castro Abarca

// 1️⃣ Función para calcular la propina
function calcularPropina(montoCuenta, porcentajePropina) {
  // Cálculo: propina = monto * (porcentaje / 100)
  const propina = montoCuenta * (porcentajePropina / 100);
  return propina; // Retorna solo el valor calculado
}

// 2️⃣ Captura de datos del usuario
const monto = parseFloat(prompt("Ingresa el monto total de la cuenta ($):"));
const porcentaje = parseFloat(prompt("Ingresa el porcentaje de propina (%):"));

// Validación básica
if (isNaN(monto) || isNaN(porcentaje) || monto <= 0 || porcentaje < 0) {
  console.log("❌ Error: Debes ingresar valores numéricos válidos.");
} else {
  // 3️⃣ Invocación de la función
  const montoPropina = calcularPropina(monto, porcentaje);

  // 4️⃣ Cálculo del total
  const totalPagar = monto + montoPropina;

  // 5️⃣ Presentación de resultados
  console.log("\n--- Resumen de la Cuenta ---");
  console.log(`Monto de la cuenta: $${monto.toFixed(2)}`);
  console.log(`Propina (${porcentaje}%): $${montoPropina.toFixed(2)}`);
  console.log(`Total a pagar: $${totalPagar.toFixed(2)}`);
}