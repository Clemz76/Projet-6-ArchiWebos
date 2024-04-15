// Variables
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const modalContainer = document.querySelector(".modalContainer");
const modal = document.querySelector(".modal");
const headerLogin = document.querySelector("#headerLogin");
const edition = document.querySelector(".edition");
const editionButton = document.querySelector(".editionButton");
const editionClose = document.querySelectorAll(".fa-xmark");
const buttonModal = document.querySelector(".buttonModal");
const modal1 = document.querySelector("#modal1");
const modal2 = document.querySelector("#modal2");
const html = document.querySelector("html");
const buttonValider = document.querySelector("buttonValider");

// Fonction get galerie
async function getWorks() {
   const response = await fetch("http://localhost:5678/api/works");
   return await response.json();
}
getWorks();

// Fonction display galerie
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

// Fonction get catégories
async function getCategories() {
   const response = await fetch("http://localhost:5678/api/categories");
   return await response.json();
}

// Fonction display boutons
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

// Fonction boutons filtres
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

// Fonction logout
headerLogin.addEventListener("click", () => {
   sessionStorage.removeItem("token");
   location.reload();
});

// Fonction checkLogin
function checkLogin() {
   const checkLoginToken = sessionStorage.getItem("token");
   console.log(checkLoginToken);
   if (checkLoginToken != undefined) {
      headerLogin.textContent = "logout";
      headerLogin.href = "#";
      edition.classList.remove("hide");
      html.classList.add("margin-edition");
   } else {
      headerLogin.href = "login.html";
      edition.classList.add("hide");
      html.classList.remove("margin-edition");
   }
}
checkLogin();

// Afficher modale
editionButton.addEventListener("click", () => {
   modalContainer.classList.remove("hide");
   modal1.classList.remove("hide");
});
editionClose.forEach((element) => {
   element.addEventListener("click", () => {
      modalContainer.classList.add("hide");
      modal1.classList.add("hide");
      modal2.classList.add("hide");
   });
});

// Fonction afficher les images dans la modale
async function displayImagesInModal(arrayWorks = null) {
   const modalGallery = document.querySelector(".modalGallery");
   modalGallery.innerHTML = "";
   if (arrayWorks == null) {
      arrayWorks = await getWorks();
   }
   arrayWorks.forEach((work) => {
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("imageContainer");
      const img = document.createElement("img");
      img.src = work.imageUrl;
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteButton.addEventListener("click", async () => {
         let workId = work.id;
         alert(work.id);
         await deleteWork(work.id); // Supprimer l'image en fonction de son ID
         displayImagesInModal(); // Actualiser la modale après la suppression
      });
      imgContainer.appendChild(img);
      imgContainer.appendChild(deleteButton);
      modalGallery.appendChild(imgContainer);
   });
}
displayImagesInModal();

// Fonction supprimer work
async function deleteWork(workId) {
   const checkLoginToken = sessionStorage.getItem("token");
   await fetch(`http://localhost:5678/api/works/${workId}`, {
      headers: {
         Authorization: "Bearer " + checkLoginToken,
      },
      method: "DELETE",
   });
}

//Afficher modale d'ajout d'images
buttonModal.addEventListener("click", () => {
   modal1.classList.add("hide");
   modal2.classList.remove("hide");
});

// Fonction ajout de photo
const formAddPhoto = document.getElementById("addPhotoForm");
const validAddPhotoButton = document.getElementById("validAddPhotoButton");
validAddPhotoButton.addEventListener("click", async (e) => {
   e.preventDefault();

   const imageUpload = document.getElementById("imageUpload").files[0];
   const title = document.getElementById("title").value;
   const category = document.getElementById("category").value;

   const formData = new FormData();
   formData.append("image", imageUpload);
   formData.append("title", title);
   formData.append("category", category);
   try {
      const checkLoginToken = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:5678/api/works/", {
         method: "POST",
         headers: {
            Authorization: "Bearer " + checkLoginToken,
         },
         body: formData,
      });

      if (response.ok) {
         displayWorks();
         displayImagesInModal();
      } else {
         alert("Erreur");
      }
   } catch (error) {
      console.error("Erreur:", error);
   }
});

// Afficher catégories dans le formulaire
async function displayCategoriesModal() {
   const categories = await getCategories();
   const select = document.getElementById("category");

   categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
   });
}
displayCategoriesModal();

// Fonction preview image
function previewImage() {
   const imageUpload = document.getElementById("imageUpload");
   const imagePreview = document.getElementById("imagePreview");
   const addPhotoIcon = document.getElementById("addPhotoIcon");
   const addPhotoButton = document.getElementById("addPhotoButton");
   const addPhotoLabel = document.getElementById("addPhotoLabel");
   if (imageUpload.files && imageUpload.files[0]) {
      addPhotoIcon.classList.add("hide");
      addPhotoButton.classList.add("hide");
      addPhotoLabel.classList.add("hide");
      const reader = new FileReader();
      reader.onload = function (e) {
         const img = document.createElement("img");
         img.src = e.target.result;
         img.classList.add("preview");
         if (imagePreview.firstChild) {
            imagePreview.removeChild(imagePreview.firstChild);
         }
         imagePreview.appendChild(img);
      };
      reader.readAsDataURL(imageUpload.files[0]);
   }
}
document.getElementById("imageUpload").addEventListener("change", previewImage);
