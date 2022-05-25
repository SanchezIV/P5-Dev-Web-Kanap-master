var str = window.location.href;
var url = new URL(str);
var orderId = url.searchParams.get("order");
console.log(orderId);
let confirm = document.getElementById("orderId");
confirm.textContent = orderId;