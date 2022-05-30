let articlesStorage = JSON.parse(localStorage.getItem("articles")); //Je récupère et transforme les données Json du storage en tableau
console.table(articlesStorage);
let totalProductPrice = 0;
let totalProductArticle = 0;

//----Si article storage est bien un array et si il est vide--------
if (Array.isArray(articlesStorage) && articlesStorage.length === 0) {
  emptyCart(); //on appelle la fonction pour le cas "panier vide"
}
//----Si il n'y à rien dans le localstorage----
if (articlesStorage === null) { 
  emptyCart();    //fonction "panier vide"

} else {//----si il y a des articles dans le localstorage----
         for (let article of articlesStorage){ 
    let id = article.id // on crée la variable "id" relié a l'id de l'article dans le storage

    //-----On se relie à l'api-------------------
    fetch(`http://localhost:3000/api/products/${id}`)

    .then((httpBodyResponse) => {
        return httpBodyResponse.json(); //on transforme la reponse de l'api au format json
      })

    .then ((product) => { // création d'une fonction pour afficher les infos produit
      
        //-----création d'un article sous la section-------
           let panier = document.createElement("article"); //création d'un "article" HTML relié a var panier
           panier.className = "cart__item" // on ajoute une class à l'article fraichement créé
           document.getElementById("cart__items").appendChild(panier); // on remplis la section html par le contenu de panier
           panier.setAttribute("data-id", id); // on ajoute des attributs a l'article
           panier.setAttribute("data-color", article.color); // ajout du deuxieme attribut a l' "article"

        //-------création d'une div sous l'article-------------
           let imgArticle = document.createElement("div"); // création d'un élément html "div" relié a la var imgArticles
           imgArticle.className = "cart__item__img"; // j'ajoute une class a la "div"
           panier.appendChild(imgArticle); // je remplis l' "article" "panier" avec la "div" imgArticles

        //---------importation d'une image dans la div-----------
           let addImg = document.createElement("img"); // création élément HTML "img" relié à la var "addImg"
           imgArticle.appendChild(addImg);// je remplis la "div" imgArticle avec l' "img" "addImg"
           addImg.src = product.imageUrl; //insertion de l'image
           addImg.alt = product.altTxt; //insertion de l'image

           //----création d'une deuxieme div dans l'article-------
           let cartItemContent = document.createElement("div");
           panier.appendChild(cartItemContent);
           cartItemContent.className = "cart__item__content";

           //-----création d'une div dans cart__item__content --------
           let cartItemContentDescription = document.createElement("div");
           cartItemContent.appendChild(cartItemContentDescription);
           cartItemContentDescription.className = "cart__item__content__description";

           //------création d'un h2 dans la div cart__item__content__description --------
           let NomDuProduit = document.createElement("h2");
           cartItemContentDescription.appendChild(NomDuProduit);
           NomDuProduit.textContent = `${product.name}`; // on insère le nom du produit en tant que titre

           //-----création d'un p dans la div cart__item__content__description ------
           let color = document.createElement("p");
           cartItemContentDescription.appendChild(color);
           color.textContent = `${article.color}`; // on insère la couleur stocké dans le localStorage

           //----création d'un autre p pour le prix dans la div cart__item__content__description------
           let price = document.createElement("p");
           cartItemContentDescription.appendChild(price);
           let getPriceTotal = product.price * article.quantity;
          //  price.textContent = article.quantity * product.price + " €";// on calcule le prix en fonction de la quantité x le prix a l'unité
          price.innerHTML = `<span class="price">${getPriceTotal}</span> €`
          totalProductPrice = totalProductPrice + getPriceTotal;

            //-----création d'une div dans cart__item__content --------
           let cartItemContentSettings = document.createElement("div");
           cartItemContent.appendChild(cartItemContentSettings);
           cartItemContentSettings.className = "cart__item__content__settings";

           //-----création d'une div dans cart__item__content__settings --------
           let cartItemContentSettingsQuantity = document.createElement("div");
           cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
           cartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

           //-----création d'un p dans la div cart__item__content__settings__quantity ------
           let qtt = document.createElement("p");
           cartItemContentSettingsQuantity.appendChild(qtt);
           qtt.textContent = "Qté : " //+ `${article.quantity}`; // on insère la couleur stocké dans le localStorage

           //------ création d'un input dans la div cart__item__content__settings__quantity ------
           let itemQuantity = document.createElement("input");
           cartItemContentSettingsQuantity.appendChild(itemQuantity);

           itemQuantity.value = article.quantity;
           itemQuantity.type = "number";
           itemQuantity.className = "itemQuantity";
           itemQuantity.min = "1";
           itemQuantity.max = "100";
           itemQuantity.name = "itemQuantity";
           totalProductArticle = totalProductArticle + article.quantity;

            itemQuantity.addEventListener("change", priceChange); // création event onchange sur l'input du prix

           //-----création d'une div dans cart__item__content__settings --------
           let cartItemContentSettingsDelete = document.createElement("div");
           cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
           cartItemContentSettingsDelete.className = "cart__item__content__settings__delete";

           //-----création d'un p dans la div cart__item__content__settings__delete----
           let deleteItem = document.createElement("p");
           cartItemContentSettingsDelete.appendChild(deleteItem);
           deleteItem.className = "deleteItem";
           deleteItem.textContent = "Supprimer";
          
           deleteItem.addEventListener("click", remove); // création event click sur le bouton Supprimer         
      
    })
    .then (() => {
      //----On affiche le prix total----
      let productTotalPrice = document.getElementById("totalPrice") 
      productTotalPrice.innerHTML = totalProductPrice;
      //---on affiche la quantité totale
      let productTotalQuantity = document.getElementById("totalQuantity");
      productTotalQuantity.textContent = totalProductArticle;
    })
    .catch((err) => {
        alert('error' + err); // en cas d'erreur le site renvoi un message d'alerte
      }); 
};
}
     
  //--------------Modification des quantités via l'input---------------------

      //---on configure la fonction de modification des qtt

function priceChange(e) {

  const inputTarget = e.target; // variable pour "viser" l'input
  let update = inputTarget.closest(".cart__item");// variable pour remonter au parent correspondant à l'input
  updateAll(update, "update", e.target.value);// on relie à la fonction "usine"
};

  //---------------CREATION EVENEMENT "OnClick" POUR SUPPRIMER----------------
      // configuration de la fonction supprimer 
function remove(e) {
  let removeTarget = e.target;
  let article = removeTarget.closest(".cart__item");
  updateAll(article, "delete", 0); // on la relie à la fonction "usine"
};

//*************Fonction "Usine" pour la MAJ prix/quantité regroupant tous les paramètres de modification des quantités**************/
let updateAll = (element, type, value) =>{
  element.dataset.id === "";
  element.dataset.color === "";

  //initialisation d'une var totalnombre à O
  let totalNombre = 0;
  //---- On parcour le tableau de storage------
  for (let [i, article] of articlesStorage.entries()) {
    let id = article.id ;
    //---- on cible l'article sélectionné via correspondance de l'id et la couleur-----
    if (element.dataset.id === article.id && element.dataset.color === article.color){

      //On stock l'ancien prix
      let oldPrice = element.querySelector(".price").textContent;
      console.log(oldPrice);

      //on remplace la quantité article par la nouvelle
      article.quantity = parseInt(value);// on transforme la valeur de la quantité de string à number grace à parseinT
      totalProductArticle = article.quantity;
      localStorage.setItem("articles", JSON.stringify(articlesStorage));

      //-----on se relie à l'api en fonction de l'id produit----
      fetch(`http://localhost:3000/api/products/${id}`)
      .then((httpBodyResponse) => {
        return httpBodyResponse.json(); //on transforme la reponse de l'api au format json
      })
      //---on récupère la réponse de l'api---
      .then ((product) => {
        let getPriceTotal = product.price * totalProductArticle; // on calcule le prix en fonction de la nouvelle quantité
        let priceTotal = element.querySelector(".price");
        priceTotal.innerHTML = getPriceTotal;//on injecte le nouveau prix en html
        

        //--calcule difference prix---
        let difference = getPriceTotal - parseInt(oldPrice);// avec parseinT on transforme la valeur de string vers nombre
        //--calcule du total en fonction de la difference entre le total et l'ancien prix--
        totalProductPrice = totalProductPrice + difference; // prix du total d'articles + la difference
        let productTotalPrice = document.getElementById("totalPrice");
        productTotalPrice.innerHTML = totalProductPrice;// on affiche le résultat en HTML
      })
      .catch((err) => {
        alert('error' + err); // en cas d'erreur le site renvoi un message d'alerte
      });   
    };
    //totalnombre prend la valeur de la quantité de l'article
    totalNombre = totalNombre + article.quantity
  };
  let totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = totalNombre;// on injecte la quantité totale en html

  //----si le le paramètre "type" de updateAll() est le meme que celui de remove()
  if (type === "delete") {
    //---on parcour le tableau de storage---
    for (let [i, article] of articlesStorage.entries()) {
      console.log(i);
      //-----on cherche l'article correspondant via l'id et la couleur---
      if (
        article.id === element.dataset.id && article.color === element.dataset.color
      ) {
        console.log(article);
        articlesStorage.splice(i, 1);// on supprime l'article du tableau
        localStorage.setItem("articles", JSON.stringify(articlesStorage));//on met à jour le localStorage()
        element.remove();//supprime l'element HTML
        
      }
      //si le tableau de storage est bien un tableau et qu'il est vide
      if (Array.isArray(articlesStorage) && articlesStorage.length === 0){
        emptyCart();//on appelle la fonction "panier vide"
 
      }
    }
  }
};
//----fonction en cas de panier vide----
function emptyCart() {
  let text = document.createElement("p"); // création variable text qui crée un élément p en HTML
  text.innerHTML = "Panier vide !"; // text prend la valeur HTML voulue
  document.getElementById("cart__items").appendChild(text);// la section "cart__items" se rempli du "text"
  //on affiche 0 dans la quantité totale
  let videqtt = document.querySelector("#totalQuantity")
  videqtt.textContent = "0";
  //on affiche 0 dans le prix total
  let videPrice = document.querySelector("#totalPrice")
  videPrice.textContent = "0"
}
//*********************LE FORMULAIRE************************/
//----------RegExp-----------------

// le regExp permet de selectionner les carractères valides pour un input choisi

let PrenomNomVilleRegExp = new RegExp(
  "^[a-zA-Z -]{2,}$"
);
let adresseRegExp = new RegExp(
  "^[a-zA-Z0-9 -,]{2,}$"
);
let emailRegExp = new RegExp(
  "^[a-zA-Z0-9.-_]{2,}[@]{1}[a-zA-Z0-9.-_]{2,}[.]{1}[a-z]{2,5}$"
);

//***********L'envoie du Formulaire******************/
let order = document.getElementById("order");
order.addEventListener("click", postOrder = (e) =>{

 e.preventDefault();
 //---------récupérations des infos produits dans un tableau------------------
  let products = [];

    for(let article of articlesStorage){
      let id = article.id;
      products.push(id);
    }
    //------------création d'un objet contact contenant les informations utilisateur-------------
    let contact = {};

let firstName = document.getElementById("firstName")//selectionner l'input prénom
let lastName = document.getElementById("lastName")//selectionner l'input nom
let address = document.getElementById("address")//selectionner l'input adresse
let city = document.getElementById("city")//selectionner l'input ville
let email = document.getElementById("email")//selectionner l'input email

let errorfirstName = document.getElementById("firstNameErrorMsg")
let errorlastName = document.getElementById("lastNameErrorMsg")
let erroraddress = document.getElementById("addressErrorMsg")
let errorcity = document.getElementById("cityErrorMsg")
let erroremail = document.getElementById("emailErrorMsg")

//implantation du RegExp à l'input correspondant via conditions IF/ELSE
if(PrenomNomVilleRegExp.test(firstName.value)){
  errorfirstName.innerHTML = "Formulaire valide!"
  errorfirstName.setAttribute("style", "color:#11D01F");
}
else{
  errorfirstName.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(PrenomNomVilleRegExp.test(lastName.value)){
  errorlastName.innerHTML = "Formulaire valide!"
  errorlastName.setAttribute("style", "color:#11D01F");
}
else{
  errorlastName.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(adresseRegExp.test(address.value)){
  erroraddress.innerHTML = "Formulaire valide!"
  erroraddress.setAttribute("style", "color:#11D01F");
}
else{
  erroraddress.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(PrenomNomVilleRegExp.test(city.value)){
  errorcity.innerHTML = "Formulaire valide!"
  errorcity.setAttribute("style", "color:#11D01F");
}
else{
  errorcity.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(emailRegExp.test(email.value)){
  erroremail.innerHTML = "Formulaire valide!"
  erroremail.setAttribute("style", "color:#11D01F");
}
else{
  erroremail.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

contact = {
  firstName: firstName.value,
  lastName: lastName.value,
  address: address.value,
  city: city.value,
  email: email.value,
};



    fetch("http://localhost:3000/api/products/order", {
      method: "post",
      body: JSON.stringify({
        contact,
        products,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      })
      .then((reponse) =>{
        if (reponse.ok) {
          return reponse.json();
        }
      })
      .then((reponse) =>{
        console.log(reponse);
        let orderId = reponse.orderId;
        location.href = `./confirmation.html?order=${orderId}`;
 
      })
      .catch(function (erreur) {
      // Une erreur est survenue
      });
});

 


  
 



