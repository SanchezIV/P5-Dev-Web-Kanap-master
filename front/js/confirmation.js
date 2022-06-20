var str = window.location.href;
var url = new URL(str);
var orderId = url.searchParams.get("order"); // on récupère l'id de commande dans l'addresse 

let confirm = document.getElementById("orderId");
confirm.textContent = orderId; // on affiche l'id de commande en HTML

localStorage.clear(); // on vide le storage
