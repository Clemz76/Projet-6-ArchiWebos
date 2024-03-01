/***Varibales***/
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

/*Fonction get galerie*/
async function getWorks() {
   const response = await fetch("http://localhost:5678/api/works");
   return await response.json();
}
getWorks();

/*Fonction display galerie*/
async function displayWorks(arrayWorks = null) {
   gallery.innerHTML = "";
   if (arrayWorks == null) {
      arrayWorks = await getWorks();
   }
   arrayWorks.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      img.src = work.imageUrl;
      figcaption.textContent = work.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
   });
}
displayWorks();

/*Fonction get catégories*/
async function getCategories() {
   const response = await fetch("http://localhost:5678/api/categories");
   return await response.json();
}

/*Fonction display boutons*/
async function displayCategoriesButtons() {
   const categories = await getCategories();
   categories.forEach((category) => {
      const btn = document.createElement("button");
      btn.textContent = category.name;
      btn.id = category.id;
      filters.appendChild(btn);
   });
}
displayCategoriesButtons();

/*Fonction boutons filtres*/
async function filtersButtons() {
   const filterWorks = await getWorks();
   const buttons = document.querySelectorAll(".filters button");
   buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
         btnId = e.target.id;
         gallery.innerHTML = "";
         if (btnId !== "0") {
            const workTriCategory = filterWorks.filter((work) => {
               return work.categoryId == btnId;
            });
            displayWorks(workTriCategory);
         } else {
            displayWorks();
         }
      });
   });
}
filtersButtons();
