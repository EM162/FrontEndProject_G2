const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const users = JSON.parse(localStorage.getItem("users")) || [];
console.log(users);
const filterdUser = users?.find((user) => user?.email === currentUser?.email);
let cart = filterdUser?.cart;
console.log(cart, filterdUser, users, currentUser);
if (currentUser) {
  $(".authenticated").show();
  $(".not-authenticated").hide();
  if (currentUser?.role === "seller")
    $("#seller-dashboard").removeClass("d-none");
  if (currentUser?.role === "admin")
    $("#admin-dashboard").removeClass("d-none");
} else {
  $(".authenticated").hide();
  $(".not-authenticated").show();
}
$("#sign-out").click(function (e) {
  e.preventDefault();
  localStorage.removeItem("currentUser");
  location.reload();
});