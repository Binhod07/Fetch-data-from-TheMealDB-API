const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealResultHeading = document.getElementById("meal-result-heading");
const allMeals = document.getElementById("meals");
const singleMeal = document.getElementById("single-meal-container");

//! function to fetch api data
function findMeal(e) {
  e.preventDefault();

  const item = search.value;

  if (item.trim()) {
    //* fetching the data
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`)
      .then(
        //* covert data to object
        (res) => res.json()

        //* returning the result
      )
      .then((data) => {
        //console.log(data);
        mealResultHeading.innerHTML = `Search Results for ${item}`;

        //* if data present show the result otherwise show no results found message
        if (!data.meals) {
          mealResultHeading.innerHTML = `No Results for ${item}`;
        } else {
          //* using map() for looping for every element
          allMeals.innerHTML = data.meals
            .map(
              (meal) => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info" data-mealId="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
          `
              //* using join() will returning array as string
            )
            .join("");
        }
      });

    //* clear input fields
    search.value = "";
  } else {
    alert("Please enter the item you want to search");
  }
}
submit.addEventListener("submit", findMeal);
random.addEventListener("click", getRandomMeal);

//! function getting random meal from API
function getRandomMeal() {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const meal = data.meals[0];
      // console.log(meal);
      addMealToDOM(meal);
    });
  //* clear search result data and heading
  allMeals.innerHTML = "";
  mealResultHeading.innerHTML = "";
}

//! function to get meal id
function getsingleItemId(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const meal = data.meals[0];
      console.log(meal);
      addMealToDOM(meal);
    });
}

//! fuction add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  //console.log(ingredients);
  singleMeal.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="main">
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map((values) => `<li>${values}</li>`).join("")}
      </ul>
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
    </div>
  </div>
  `;
}

//* single meal click
allMeals.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((singleItem) => {
    //console.log(singleItem);

    //* checking which element is having class meal-info
    if (singleItem.classList) {
      return singleItem.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  //console.log(mealInfo);

  //* checking which items are having ID
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealId");
    //console.log(mealId);
    getsingleItemId(mealId);
  }
});
