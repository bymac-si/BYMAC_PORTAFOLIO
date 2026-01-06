// assets/js/app.js

// =====================
// Config API (TheMealDB)
// =====================
const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const urlFilterByIngredient = (ingredient) =>
  `${API_BASE}/filter.php?i=${encodeURIComponent(ingredient.trim())}`;
const urlLookupById = (id) =>
  `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`;
const urlRandomMeal = () => `${API_BASE}/random.php`;

// =====================
// Config Traducción (MyMemory - sin API key)
// =====================
const MYMEMORY_BASE = "https://api.mymemory.translated.net/get";

// =====================
// DOM
// =====================
const form = document.getElementById("search-form");
const input = document.getElementById("inputBusqueda");
const resultsContainer = document.getElementById("results");
const resultsTitle = document.getElementById("results-title");

const recommendedSection = document.getElementById("recommended-section");
const recommendedContainer = document.getElementById("recommended-results");

// Modal DOM
const recipeModalEl = document.getElementById("recipeModal");
const modalLabel = document.getElementById("recipeModalLabel");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalArea = document.getElementById("modalArea");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");
const modalTranslated = document.getElementById("modalTranslated");
const modalYoutube = document.getElementById("modalYoutube");

const langSelect = document.getElementById("langSelect");
const liveTranslateSwitch = document.getElementById("liveTranslateSwitch");
const translateStatus = document.getElementById("translateStatus");

let recipeModalInstance = null;

// Estado modal
let currentMeal = null;
let currentOriginalText = "";
let currentSourceLang = "en";
const translationCache = new Map(); // key: `${source}__${target}__${text}`

// =====================
// POO: modelo Receta (cards)
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
  if (resultsContainer) resultsContainer.innerHTML = "";
};

const setTitle = (text) => {
  if (resultsTitle) resultsTitle.textContent = text;
};

const renderMessage = (message) => {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = `
    <div class="col-12">
      <div class="alert alert-info mb-0" role="alert">
        ${message}
      </div>
    </div>
  `;
};

const renderLoading = (container) => {
  if (!container) return;
  container.innerHTML = `
    <div class="col-12 d-flex justify-content-center py-4">
      <div class="spinner-border" role="status" aria-label="Cargando">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `;
};

// Card HTML (mismo layout Sprint 1)
const createRecipeCardHTML = ({ id, nombre, imagen }) => {
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img
          src="${imagen}"
          class="card-img-top"
          alt="Receta: ${nombre}"
          style="height:240px; object-fit:cover;"
          loading="lazy"
        >
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nombre}</h5>
          <p class="card-text flex-grow-1">
            Haz clic para ver ingredientes e instrucciones completas.
          </p>
          <a href="#" class="btn btn-primary mt-2" data-action="open-recipe" data-id="${id}">
            Ver receta
          </a>
        </div>
      </div>
    </div>
  `;
};

// =====================
// Data (TheMealDB)
// =====================
const fetchRecipesByIngredient = async (ingredient) => {
  const res = await fetch(urlFilterByIngredient(ingredient));
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json(); // { meals: [...] } o { meals: null }
};

const fetchMealById = async (id) => {
  const res = await fetch(urlLookupById(id));
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  const data = await res.json();
  return data?.meals?.[0] || null;
};

const fetchRandomMeal = async () => {
  const res = await fetch(urlRandomMeal());
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  const data = await res.json();
  return data?.meals?.[0] || null;
};

const extractIngredients = (meal) => {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const mea = meal[`strMeasure${i}`];
    if (ing && ing.trim()) items.push(`${(mea || "").trim()} ${(ing || "").trim()}`.trim());
  }
  return items;
};

// =====================
// Traducción
// =====================
const setTranslateStatus = (text) => {
  if (translateStatus) translateStatus.textContent = text || "";
};

const guessSourceLang = (text) => {
  const t = (text || "").toLowerCase();
  const hasSpanishChars = /[áéíóúñü]/.test(t);
  const hasSpanishWords = /\b(mezcla|hornea|cocina|agrega|sirve|corta|calienta|minutos)\b/.test(t);
  return (hasSpanishChars || hasSpanishWords) ? "es" : "en";
};

const translateText = async (text, sourceLang, targetLang) => {
  const clean = (text || "").trim();
  if (!clean) return "";
  if (sourceLang === targetLang) return clean;

  const cacheKey = `${sourceLang}__${targetLang}__${clean}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);

  const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(clean)}&langpair=${encodeURIComponent(sourceLang)}|${encodeURIComponent(targetLang)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error traducción HTTP ${res.status}`);

  const data = await res.json();
  const translated = (data?.responseData?.translatedText || "").trim();

  translationCache.set(cacheKey, translated);
  return translated;
};

// Traducir ingrediente ES->EN SOLO como fallback
const translateIngredientEsToEn = async (ingredient) => {
  const clean = (ingredient || "").trim();
  if (!clean) return "";

  const cacheKey = `es__en__${clean.toLowerCase()}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);

  const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(clean)}&langpair=es|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error traducción ingrediente HTTP ${res.status}`);

  const data = await res.json();
  const translated = (data?.responseData?.translatedText || "").trim();

  const normalized = translated.toLowerCase().replace(/[^\w\s-]/g, "").trim();
  translationCache.set(cacheKey, normalized);
  return normalized;
};

const runLiveTranslation = async () => {
  if (!liveTranslateSwitch?.checked) return;
  if (!modalTranslated || !langSelect) return;
  if (!currentOriginalText) return;

  const target = langSelect.value || "es";

  try {
    setTranslateStatus("Traduciendo...");
    modalTranslated.textContent = "Traduciendo...";
    const t = await translateText(currentOriginalText, currentSourceLang, target);
    modalTranslated.textContent = t || "(No se pudo traducir.)";
    setTranslateStatus("");
  } catch (e) {
    console.error(e);
    modalTranslated.textContent = "(Error al traducir. Intenta nuevamente o cambia de idioma.)";
    setTranslateStatus("");
  }
};

// =====================
// Modal
// =====================
const ensureModalInstance = () => {
  if (!recipeModalEl) return null;
  if (!window.bootstrap) {
    console.error("Bootstrap JS no está cargado. Revisa el <script> del bundle.");
    return null;
  }
  if (!recipeModalInstance) recipeModalInstance = new bootstrap.Modal(recipeModalEl);
  return recipeModalInstance;
};

const resetModalUI = () => {
  if (!modalLabel || !modalTitle || !modalImg) return;

  modalLabel.textContent = "Cargando receta...";
  modalTitle.textContent = "Cargando...";
  modalImg.src = "";
  modalImg.alt = "";
  if (modalCategory) modalCategory.textContent = "Categoría";
  if (modalArea) modalArea.textContent = "Origen";
  if (modalIngredients) modalIngredients.innerHTML = "";
  if (modalInstructions) modalInstructions.textContent = "";
  if (modalTranslated) modalTranslated.textContent = "";
  if (modalYoutube) modalYoutube.style.display = "none";
  setTranslateStatus("");
};

const fillModalWithMeal = async (meal) => {
  if (!meal) return;

  currentMeal = meal;

  const { strMeal, strMealThumb, strCategory, strArea, strInstructions, strYoutube } = meal;

  modalLabel.textContent = "Receta";
  modalTitle.textContent = strMeal || "Receta";

  modalImg.src = strMealThumb || "";
  modalImg.alt = strMeal ? `Foto de ${strMeal}` : "Foto receta";

  if (modalCategory) modalCategory.textContent = strCategory || "Categoría";
  if (modalArea) modalArea.textContent = strArea || "Origen";

  if (modalIngredients) {
    const ings = extractIngredients(meal);
    modalIngredients.innerHTML = ings.map((x) => `<li>${x}</li>`).join("");
  }

  currentOriginalText = (strInstructions || "").trim();
  if (modalInstructions) modalInstructions.textContent = currentOriginalText || "Sin instrucciones disponibles.";

  currentSourceLang = guessSourceLang(currentOriginalText);

  if (modalYoutube && strYoutube && strYoutube.trim()) {
    modalYoutube.href = strYoutube.trim();
    modalYoutube.style.display = "inline-block";
  }

  await runLiveTranslation();
};

const openRecipeModalById = async (mealId) => {
  try {
    resetModalUI();
    const instance = ensureModalInstance();
    if (instance) instance.show();

    const meal = await fetchMealById(mealId);
    if (!meal) {
      modalLabel.textContent = "Receta";
      modalTitle.textContent = "No encontrada";
      if (modalInstructions) modalInstructions.textContent = "No se pudo cargar la receta. Intenta con otra.";
      return;
    }
    await fillModalWithMeal(meal);
  } catch (err) {
    console.error(err);
    if (modalLabel) modalLabel.textContent = "Receta";
    if (modalTitle) modalTitle.textContent = "Error";
    if (modalInstructions) modalInstructions.textContent =
      "Ocurrió un error cargando la receta. Revisa tu conexión e inténtalo nuevamente.";
  }
};

// =====================
// Recomendadas desde TheMealDB (6 recetas reales)
// =====================
const fetchRecommendedMeals = async (limit = 6) => {
  const meals = [];
  const usedIds = new Set();

  // Hacemos llamadas a random.php hasta tener "limit" recetas únicas
  let guard = 0;
  while (meals.length < limit && guard < limit * 4) {
    guard++;
    const meal = await fetchRandomMeal();
    if (meal?.idMeal && !usedIds.has(meal.idMeal)) {
      usedIds.add(meal.idMeal);
      meals.push(meal);
    }
  }

  return meals;
};

const renderRecommended = (meals) => {
  if (!recommendedContainer) return;

  const recetas = meals.map((m) => new Receta(m));
  recommendedContainer.innerHTML = recetas.map(createRecipeCardHTML).join("");
};

const loadRecommendedOnStart = async () => {
  if (!recommendedContainer) return;

  try {
    renderLoading(recommendedContainer);
    const meals = await fetchRecommendedMeals(6);
    renderRecommended(meals);
  } catch (err) {
    console.error(err);
    recommendedContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning mb-0">
          No se pudieron cargar las recetas recomendadas.
        </div>
      </div>
    `;
  }
};

// =====================
// Controller: Búsqueda (fallback ES->EN)
// =====================
const handleSearch = async (event) => {
  event.preventDefault();

  const ingredientUser = (input?.value || "").trim();
  clearResults();

  if (!ingredientUser || ingredientUser.length < 2) {
    setTitle("Resultados");
    renderMessage("Escribe un ingrediente válido (mínimo 2 caracteres).");
    return;
  }

  // Oculta recomendadas al buscar
  if (recommendedSection) recommendedSection.style.display = "none";

  try {
    setTitle(`Resultados para: "${ingredientUser}"`);
    renderLoading(resultsContainer);

    // 1) intento directo (si viene en inglés)
    let data = await fetchRecipesByIngredient(ingredientUser);

    // 2) si no hay resultados, traducimos ES->EN y reintentamos
    if (data.meals === null) {
      const translatedEn = await translateIngredientEsToEn(ingredientUser);

      if (translatedEn && translatedEn !== ingredientUser.toLowerCase()) {
        setTitle(`Resultados para: "${ingredientUser}" (buscando: ${translatedEn})`);
        renderLoading(resultsContainer);
        data = await fetchRecipesByIngredient(translatedEn);
      }
    }

    if (data.meals === null) {
      renderMessage(
        `Lo sentimos, no se encontraron recetas para "${ingredientUser}". Intenta con otro ingrediente.`
      );
      return;
    }

    const recetas = data.meals.map((m) => new Receta(m));
    resultsContainer.innerHTML = recetas.map(createRecipeCardHTML).join("");
  } catch (err) {
    console.error(err);
    setTitle("Resultados");
    renderMessage("Ocurrió un problema al buscar recetas. Revisa tu conexión e inténtalo nuevamente.");
  }
};

// =====================
// Events
// =====================
if (form) form.addEventListener("submit", handleSearch);

// Click en resultados (búsqueda)
if (resultsContainer) {
  resultsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="open-recipe"]');
    if (!btn) return;

    e.preventDefault();
    const id = btn.getAttribute("data-id");
    if (id) openRecipeModalById(id);
  });
}

// Click en recomendadas (desde API)
if (recommendedContainer) {
  recommendedContainer.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="open-recipe"]');
    if (!btn) return;

    e.preventDefault();
    const id = btn.getAttribute("data-id");
    if (id) openRecipeModalById(id);
  });
}

// Traducción en vivo: cambia idioma => re-traduce
if (langSelect) {
  langSelect.addEventListener("change", () => {
    if (liveTranslateSwitch?.checked) runLiveTranslation();
  });
}

// Switch traducción en vivo
if (liveTranslateSwitch) {
  liveTranslateSwitch.addEventListener("change", async () => {
    if (!modalTranslated) return;
    if (liveTranslateSwitch.checked) await runLiveTranslation();
    else {
      modalTranslated.textContent = "";
      setTranslateStatus("");
    }
  });
}

// Cargar recomendadas al iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadRecommendedOnStart();
});