// Controller chính cho cửa hàng
app.controller('ShopController', function($scope) {
    $scope.shopName = "Online Shop";
});

// Controller cho danh sách sản phẩm
app.controller('ProductController', function($scope, ProductService) {
    $scope.products = ProductService.getProducts();
});

// Controller cho giỏ hàng
app.controller('CartController', function($scope, CartService) {
    $scope.cartItems = CartService.getCartItems();
});
