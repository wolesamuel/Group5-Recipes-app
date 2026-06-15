const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

// Search on Enter
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) searchRecipes(query);
  }
});

async function searchRecipes(query) {
  loadingDiv.classList.remove('hidden');
  resultsDiv.innerHTML = '';
  resultsDiv.classList.remove('hidden'); // show grid again for new search

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    
    loadingDiv.classList.add('hidden');
    
    if (data.meals) {
      displayRecipes(data.meals);
    } else {
      resultsDiv.innerHTML = `<p class="col-span-full text-gray-500 text-lg mt-10">No recipes found for "${query}". Try "Chicken", "Pasta", "Rice"</p>`;
    }
  } catch (error) {
    loadingDiv.classList.add('hidden');
    resultsDiv.innerHTML = `<p class="col-span-full text-red-500">Error loading recipes</p>`;
  }
}

function displayRecipes(meals) {
  resultsDiv.innerHTML = meals.map(meal => `
    <div onclick="showRecipe(${meal.idMeal})" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48 object-cover">
      <div class="p-5 text-left">
        <h3 class="font-bold text-xl text-[#0B4D2B] mb-2">${meal.strMeal}</h3>
        <p class="text-gray-600 text-sm">
          <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">${meal.strCategory}</span>
          <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs ml-2">${meal.strArea}</span>
        </p>
        <button class="mt-3 bg-[#0B4D2B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#08381F] w-full">View Recipe</button>
      </div>
    </div>
  `).join('');
}

// Hide results grid, show full recipe in same space
async function showRecipe(id) {
  resultsDiv.classList.add('hidden'); // HIDE THE GRID
  loadingDiv.classList.remove('hidden');
  
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];

    // Build ingredients
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients += `
          <div class="flex justify-between items-center border-b border-gray-100 py-3">
            <span class="font-medium">${ingredient}</span>
            <span class="text-gray-600">${measure}</span>
          </div>
        `;
      }
    }

    // Replace grid with full recipe
    resultsDiv.innerHTML = `
      <div class="col-span-full">
        <button onclick="backToResults()" class="mb-8 flex items-center gap-2 text-[#0B4D2B] font-semibold text-lg hover:gap-4 transition">
          ← Back to Results
        </button>
        
        <img src="${meal.strMealThumb}" class="w-full h-80 md:h-96 object-cover rounded-3xl shadow-xl mb-8">
        
        <h1 class="text-4xl font-bold text-[#0B4D2B] mb-3">${meal.strMeal}</h1>
        <p class="text-gray-600 text-lg mb-10">
          <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">${meal.strCategory}</span>
          <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full ml-2">${meal.strArea}</span>
        </p>

        <div class="grid lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 shadow-lg">
            <h3 class="text-2xl font-bold mb-6 text-[#0B4D2B]">Ingredients</h3>
            <div class="space-y-0">${ingredients}</div>
          </div>
          
          <div class="bg-white rounded-3xl p-8 shadow-lg">
            <h3 class="text-2xl font-bold mb-6 text-[#0B4D2B]">Instructions</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line text-lg">${meal.strInstructions}</p>
          </div>
        </div>
      </div>
    `;
    
    loadingDiv.classList.add('hidden');
    resultsDiv.classList.remove('hidden'); // show recipe in same container
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    loadingDiv.classList.add('hidden');
    resultsDiv.innerHTML = `<p class="col-span-full text-red-500">Failed to load recipe</p>`;
    resultsDiv.classList.remove('hidden');
  }
}

// Back button: hide recipe, show grid again
function backToResults() {
  resultsDiv.innerHTML = ''; // clear recipe
  searchRecipes(searchInput.value.trim()); // re-run last search to show grid
}
