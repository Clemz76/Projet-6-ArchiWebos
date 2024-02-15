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
async function displayWorks() {
   const arrayWorks = await getWorks();
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
