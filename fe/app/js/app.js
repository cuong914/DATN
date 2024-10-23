// Khai báo module AngularJS
var app = angular.module('shopApp', ['ngRoute']);

// Cấu hình route để điều hướng giữa các trang
app.config(function($routeProvider) {
  $routeProvider
      .when("/", {
        templateUrl : "home.html"
      })
      .when("/products", {
        templateUrl : "products.html",
        controller : "ProductController"
      })
      .when("/cart", {
        templateUrl : "cart.html",
        controller : "CartController"
      });
});
