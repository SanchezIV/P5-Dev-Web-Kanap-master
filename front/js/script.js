 fetch("http://localhost:3000/api/products") // se lier à l'api contenant les produits
  .then((httpBodyResponse) => {
    return httpBodyResponse.json(); //on transforme la reponse au format json
  })
  .then((products) => {
    for (let product of products) { //on déclare la variable "product" de la liste de "products"
      console.log(product)
      //************on sélectionne l'ID' html a modifier et on remplis avec les infos des "product"**********
      document.querySelector('#items').innerHTML += `<a href="./product.html?id=${product._id}"> 
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>` 
    }
  })
  .catch((err) => {
    alert('error' + err); // en cas d'erreur le site renvoi un message d'alerte
  });
  
