var url = new URL(window.location.href); //**********je crée une nouvelle URL en fonction de l'id**************
var id = url.searchParams.get("id"); // je recupère l'id du produit
console.log(id);

fetch(`http://localhost:3000/api/products/${id}`) // se lier à l'api contenant les infos produits en inserant l'id produit dans l'url
  .then((httpBodyResponse) => {
    return httpBodyResponse.json(); //on transforme la reponse de l'api au format json
  })
  .then((product) => { // création fonction product permettant d'afficher les infos produits et le choix couleur/quantité
      console.log(product);

      //----Implentation de l'image du produit------------------
    let img = document.createElement("img"); //création d'un élément image
    document.querySelector(".item__img").appendChild(img); // séléction de la class html correspondant a l'image
    img.src = product.imageUrl; // implantation de la "source" de l'img
    img.alt = product.altTxt; // implantation de la description de l'img 
    console.log(img)

    //----Implantation du nom du produit------------------------
    let name = document.getElementById("title"); // séléction class titre
    name.innerHTML = product.name; //insertion html du nom
    console.log(name);

    //----Implantation du prix du Produit-----------------------
    let price = document.getElementById("price");// séléction id price
    price.innerHTML = product.price; //insertien du prix dans le html
    console.log(price);

    //----Implantation de la description du produit-------------
    let description = document.getElementById("description");// séléction id description
    description.innerHTML = product.description; //insertien du description dans le html
    console.log(description);

    //----Implantation du choix de la couleur du produit--------
    let colors = product.colors; // on séléctionne le array des couleurs

    for (let color of colors) { // initialisation de la boucle pour parcourir le array
        console.log(color);
        let choix = document.createElement("option"); // création variable relié à l'élément html option (une option se crée pour chaque possibilité)
        document.getElementById("colors").appendChild(choix); // création d'un "enfant"(option) à l'élément html select
        choix.value = color; // la valeur de l'enfant deviens celle choisie par l'utilisateur
        choix.innerHTML = color; // implantation html de la valeur choisie
    }
    }
  )
  .catch((err) => {
    alert('error' + err); // en cas d'erreur le site renvoi un message d'alerte
  });

  //------Ajout au panier--------
  //------Addevent OnClick sur le bouton "Ajouter au panier"----
  const addToCart = document.getElementById("addToCart"); //on relie l'élément html button "addToCart"

  addToCart.addEventListener('click', addPanier)  // création événement au click de l'élément html button
    
    //*******************création fonction addPanier pour ajouter au panier********************
    function addPanier (e) { 

      //--------récupérations des options séléctionnées par l'utilisateur----------------

      let colorValue = document.getElementById("colors"); // on relie l'élément html select "colors"
      let color = colorValue.value; // la color deviens l'option choisi dans le select par l'utilisateur précédement

      if(color === "") { // fonction "si" l'utilisateur n'a rien choisi
        alert("Aucune couleur choisie, veuillez séléctionner une des options.");
        return false;     
      };
      
      let itemQuantity = document.getElementById("quantity");// on relie l'élément html input "quantity"
      let quantity = itemQuantity.value; // la quantité deviens celle choisi par l'utilisateur
      
      //***********************création de la variable "articles" comprenant les infos des articles séléctionnés*******************
      let articles = { 
        id: id,
        color: color,
        quantity: Number(quantity),
      };

      //---------------------Le LocalStorage-------------

      let articlesStorage = JSON.parse(localStorage.getItem("articles")); //On transforme les données JSON en objet JS
      console.table(articlesStorage);

      //*************si le stockage ne contient rien**********************
      if(articlesStorage === null) {  
        articlesStorage = []; // on crée un tableau vide
        articlesStorage.push(articles); // on ajoute au tableau les infos des articles séléctionnés
        localStorage.setItem("articles", JSON.stringify(articlesStorage)); //On ajoute le tableau au Local storage en le convertissant en JSON
      } 

      //*****************si il y à déja quelque chose dans le stockage*********************
      else { 
        let find = false; // on defini une variable "find" sur false par défaut qui défini si oui ou non un article correspond dans le storage

        // on parcour le stockage
        for(let product of articlesStorage) { // on commence par itéré le tableau pour trouver un articles correspondant

          //********************si il y à déja un article correspondant**********************
          if(product.id === articles.id && product.color === articles.color) { 
            product.quantity = articles.quantity + product.quantity; // on ajoute la quantité demandée (qtt LocalStorage = qtt panier + qtt LocalStorage*init*) 

            // si il y à trop d'articles
            if(product.quantity > 100) {
              product.quantity = 100;
              alert("Vous ne pouvez dépasser les 100 articles.")
            }

            localStorage.setItem("articles", JSON.stringify(articlesStorage)); // on reconverti le tableau en format Json
            find = true; // la variable "find" deviens true si un article correspondait déja 
          };
        };

        //*****************si aucun article correspondant n'est trouvé**************
        if(find === false){ // si find toujours = false nous n'avons donc trouvé aucun article correspondant.
          articlesStorage.push(articles);
          localStorage.setItem("articles", JSON.stringify(articlesStorage));
        }
    }
    }