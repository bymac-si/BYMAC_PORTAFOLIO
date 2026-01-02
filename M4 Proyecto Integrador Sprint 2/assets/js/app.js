// assets/js/app.js

// =====================
// Config API (TheMealDB)
// =====================
const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const urlFilterByIngredient = (ingredient) =>
  `${API_BASE}/filter.php?i=${encodeURIComponent(ingredient.trim())}`;

// =====================
// DOM
// =====================
const form = document.getElementById("search-form");
const input = document.getElementById("inputBusqueda");
const resultsContainer = document.getElementById("results");
const resultsTitle = document.getElementById("results-title"); // opcional

// Validación básica de DOM
if (!form || !input || !resultsContainer) {
  console.error(
    "Faltan elementos: asegúrate de tener #search-form, #inputBusqueda y #results en el HTML."
  );
}

// =====================
// (Opcional recomendado) POO: modelo Receta
// =====================
class Receta {
  constructor({ idMeal, strMeal, strMealThumb }) {
    this.id = idMeal;
    this.nombre = strMeal;
    this.imagen = strMealThumb;
  }
}

// =====================
// Helpers UI
// =====================
const clearResults = () => {
  resultsContainer.innerHTML = "";
};

const setTitle = (text) => {
  if (resultsTitle) resultsTitle.textContent = text;
};

const renderMessage = (message) => {
  resultsContainer.innerHTML = `
    <div class="col-12">
      <div class="alert alert-info mb-0" role="alert">
        ${message}
      </div>
    </div>
  `;
};

const renderLoading = () => {
  resultsContainer.innerHTML = `
    <div class="col-12 d-flex justify-content-center py-4">
      <div class="spinner-border" role="status" aria-label="Cargando">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `;
};

// Card HTML: replica tu Sprint 1 (misma estructura/clases)
const createRecipeCardHTML = ({ id, nombre, imagen }) => {
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img
          src="${imagen}"
          class="card-img-top"
          alt="Receta: ${nombre}"
        >
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nombre}</h5>
          <p class="card-text flex-grow-1">
            Receta encontrada para tu búsqueda. (Descripción no disponible en este endpoint)
          </p>
          <a href="#" class="btn btn-primary mt-2" data-id="${id}">
            Ver receta
          </a>
        </div>
      </div>
    </div>
  `;
};

const renderRecipes = (recipes) => {
  const html = recipes.map((r) => createRecipeCardHTML(r)).join("");
  resultsContainer.innerHTML = html;
};

// =====================
// Data
// =====================
const fetchRecipesByIngredient = async (ingredient) => {
  const res = await fetch(urlFilterByIngredient(ingredient));
  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}`);
  }
  return res.json(); // { meals: [...] } o { meals: null }
};

// =====================
// Controller
// =====================
const handleSearch = async (event) => {
  event.preventDefault(); // ✅ HU-04

  const ingredient = input.value; // ✅ HU-04 (captura)

  clearResults(); // ✅ HU-05 (limpia anterior)

  // Validación simple
  if (!ingredient || ingredient.trim().length < 2) {
    setTitle("Resultados");
    renderMessage("Escribe un ingrediente válido (mínimo 2 caracteres).");
    return;
  }

  try {
    setTitle(`Resultados para: "${ingredient.trim()}"`);
    renderLoading();

    const { meals } = await fetchRecipesByIngredient(ingredient); // ✅ async/await + destructuring

    // ✅ HU-06: sin resultados
    if (meals === null) {
      renderMessage(
        "Lo sentimos, no se encontraron recetas. Intenta con otro ingrediente."
      );
      return;
    }

    // Normaliza datos con POO (opcional recomendado)
    const recetas = meals.map((m) => new Receta(m));
    renderRecipes(recetas); // ✅ HU-05
  } catch (err) {
    console.error(err);
    setTitle("Resultados");
    renderMessage(
      "Ocurrió un problema al buscar recetas. Revisa tu conexión e inténtalo nuevamente."
    );
  }
};

// =====================
// Events
// =====================
if (form) {
  form.addEventListener("submit", handleSearch);
}