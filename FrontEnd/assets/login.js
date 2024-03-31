// Variables
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const error = document.querySelector(".login p");
const buttonLogin = document.querySelector("#buttonLogin");
const erreurMessage = document.querySelector("#erreurMessage");

// Fonction login

buttonLogin.addEventListener("click", (e) => {
   e.preventDefault();
   const userEmail = email.value;
   const userPassword = password.value;
   fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
   })
      .then((response) => {
         if (!response.ok) {
            throw new Error("Erreur");
         }
         return response.json();
      })
      .then((data) => {
         sessionStorage.setItem("token", data.token);
         location.href = "../FrontEnd/index.html";
      })
      .catch((error) => {
         console.error("Erreur", error);
         erreurMessage.style.display = "block";
      });
});
