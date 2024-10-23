// Service để quản lý sản phẩm
app.service('ProductService', function() {
    var products = [
        { id: 1, name: 'Product 1', price: 100, image: 'images/product1.jpg' },
        { id: 2, name: 'Product 2', price: 200, image: 'images/product2.jpg' }
    ];

    this.getProducts = function() {
        return products;
    };
});

// Service để quản lý giỏ hàng
app.service('CartService', function() {
    var cartItems = [];

    this.addToCart = function(product) {
        cartItems.push(product);
    };

    this.getCartItems = function() {
        return cartItems;
    };
});
