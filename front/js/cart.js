let articlesStorage = JSON.parse(localStorage.getItem("articles")); //Je récupère et transforme les données Json du storage en tableau
console.table(articlesStorage);

let totalProductPrice = 0;
let totalProductArticle = 0;

//----On parcour le Tableau du LocalStorage------------
for (let article of articlesStorage){ 
    let id = article.id // on crée la variable "id" relié a l'id de l'article dans le storage

    //-----On se relie à l'api-------------------
    fetch(`http://localhost:3000/api/products/${id}`)

    .then((httpBodyResponse) => {
        return httpBodyResponse.json(); //on transforme la reponse de l'api au format json
      })

    .then ((product) => { // création d'une fonction pour afficher les infos produit
      
      //--------si le panier est vide-------
        if(articlesStorage === null){ 
            let text = document.createElement("p"); // création varizable text qui crée un élément p en HTML
            text = `<p>Panier vide !</p>`; // text prend la valeur HTML voulue
            document.getElementById("cart__items").appendChild(text);// la section "cart__items" se rempli du "text"
       }

       //-----si il y à déja qqch dans le panier-------
       else {

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
       };
    })
    .then (() => {
      let productTotalPrice = document.getElementById("totalPrice")
      productTotalPrice.innerHTML = totalProductPrice;

      let productTotalQuantity = document.getElementById("totalQuantity");
      productTotalQuantity.textContent = totalProductArticle;
    })
    .catch((err) => {
        alert('error' + err); // en cas d'erreur le site renvoi un message d'alerte
      }); 
};



  //--------------Modification des quantités via l'input---------------------

      //---on configure la fonction de modification des qtt

function priceChange(e) {

  const inputTarget = e.target; // variable pour "viser" l'input
  let inputClosest = inputTarget.closest(".cart__item");// variable pour remonter au parent correspondant à l'input
  inputClosest.dataset.id === ""; // notre variable prend les valeurs d'id et de couleur de son parent
  inputClosest.dataset.color === "";
  inputClosest.value = e.target.value; // notre première variable prend la valeur interieur de l'input

  let totalNombre = 0;

  for (let article of articlesStorage){
    let id = article.id ;
    
    if (inputClosest.dataset.id === article.id && inputClosest.dataset.color === article.color){

      //On stock l'ancien prix
      let oldPrice = inputClosest.querySelector(".price").textContent;
      console.log(oldPrice);
      article.quantity = parseInt(inputClosest.value);
      totalProductArticle = article.quantity;
      localStorage.setItem("articles", JSON.stringify(articlesStorage));

      fetch(`http://localhost:3000/api/products/${id}`)
      .then((httpBodyResponse) => {
        return httpBodyResponse.json(); //on transforme la reponse de l'api au format json
      })

      .then ((product) => {
        let getPriceTotal = product.price * totalProductArticle;
        let priceTotal = inputClosest.querySelector(".price");
        priceTotal.innerHTML = getPriceTotal;
        

        //calcule difference prix

        let difference = getPriceTotal - parseInt(oldPrice);
        totalProductPrice = totalProductPrice + difference;
        let productTotalPrice = document.getElementById("totalPrice");
        productTotalPrice.innerHTML = totalProductPrice;
        // article.quantity = inputClosest.value;
        // lastPrice.textContent = article.quantity * product.price;

        // localStorage.setItem("articles", JSON.stringify(articlesStorage));
      })
      .catch((err) => {
        alert('error' + err); // en cas d'erreur le site renvoi un message d'alerte
      });   
    };
    totalNombre = totalNombre + article.quantity
    console.log(totalNombre);
  };
  let totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = totalNombre;
};

  //---------------CREATION EVENEMENT "OnClick" POUR SUPPRIMER----------------
      // configuration de la fonction supprimer 
function remove(e) {
  let removeTarget = e.target;
  let removeClosest = removeTarget.closest(".cart__item");
  removeClosest.dataset.id ==="";
  removeClosest.dataset.color === "";

  for (let article of articlesStorage){
    if(removeClosest.dataset.id === article.id && removeClosest.dataset.color === article.color){

      articlesStorage.splice(removeTarget.index, 1);
      localStorage.setItem("articles", JSON.stringify(articlesStorage))
      removeClosest.remove();
      location.reload();
    }
  }
};


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

//implantation du RegExp à l'input correspondant
if(PrenomNomVilleRegExp.test(firstName.value)){
  errorfirstName.innerHTML = "Formulaire valide!"
}
else{
  errorfirstName.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(PrenomNomVilleRegExp.test(lastName.value)){
  errorlastName.innerHTML = "Formulaire valide!"
}
else{
  errorlastName.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(adresseRegExp.test(address.value)){
  erroraddress.innerHTML = "Formulaire valide!"
}
else{
  erroraddress.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(PrenomNomVilleRegExp.test(city.value)){
  errorcity.innerHTML = "Formulaire valide!"
}
else{
  errorcity.innerHTML = "Formulaire invalide!";
  alert("votre formulaire n'est pas valide");
  return false;
}

if(emailRegExp.test(email.value)){
  erroremail.innerHTML = "Formulaire valide!"
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

 


  
 



