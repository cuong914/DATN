package com.example.shopapp.service;

import com.example.shopapp.dtos.ProductDTO;
import com.example.shopapp.dtos.ProductImageDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.exception.InvalidParamException;
import com.example.shopapp.models.Category;
import com.example.shopapp.models.Product;
import com.example.shopapp.models.ProductImage;
import com.example.shopapp.repositorys.CategoryRepository;
import com.example.shopapp.repositorys.ProductImageReponsitory;
import com.example.shopapp.repositorys.ProductRepository;
import com.example.shopapp.response.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor //
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
//    private final ProductImageReponsitory productImageReponsitory;
    private final CategoryRepository categoryRepository;
    private final ProductImageReponsitory productImageReponsitory;

    @Override
    public Product createProduct(ProductDTO productDTO) throws DaTanotFoundException {
        Category existingCategory = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new DaTanotFoundException("cannot find category with id:" + productDTO.getCategoryId()));
        Product newProduct = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .thumbnail(productDTO.getThumbnail())
                .description(productDTO.getDescription())
                .numberProduct(productDTO.getNumberProduct())
                .active(true)
                .category(existingCategory)
                .build();

        return productRepository.save(newProduct);
    }

    private void  updateThumbnail(Product product) {
        String firstImage = productImageReponsitory.findFirstImageByProductId(product.getId());
        if (firstImage != null) {
            product.setThumbnail(firstImage);
            productRepository.save(product);
        }
    }
    @Override
    public Product getProductById(long productId) throws Exception {
        Optional<Product> optionalProduct = productRepository.getDetailProduct(productId);
        if(optionalProduct.isPresent()) {
            return optionalProduct.get();
        }
        throw new DaTanotFoundException("Cannot find product with id =" + productId);
    }


    @Override
    public Page<ProductResponse> getAllProducts(String keyword ,
                                                Long categoryId,PageRequest pageRequest) {
        // lấy danh sách sản phẩm theo page và limit(), categoryId (neeus cos )
        Page<Product> productPage;
        productPage = productRepository.searProduct(categoryId,keyword,pageRequest);
        return productPage.map(ProductResponse::fromProduct);// tham chiều đến method static response
    }

    @Override
    public Product updateProduct(long id, ProductDTO productDTO) throws Exception {
        Product existingProduct = getProductById(id);
        if (existingProduct != null) {
            // copy các thuọc tính từ dto sang product

            Category existingCategory = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new DaTanotFoundException("cannot find category with id:" + productDTO.getCategoryId()));

            existingProduct.setName(productDTO.getName());
            existingProduct.setCategory(existingCategory);
            existingProduct.setPrice(productDTO.getPrice());
            existingProduct.setActive(productDTO.getActive());
            existingProduct.setNumberProduct(productDTO.getNumberProduct());
            existingProduct.setDescription(productDTO.getDescription());
           // existingProduct.setThumbnail(productDTO.getThumbnail());
            // còn phần file thì lưu tỏng bản productIamge
            // Lấy ảnh đầu tiên từ bảng product_image
            List<ProductImage> productImages = productImageReponsitory.findByProductId(id);
            if (productImages != null && !productImages.isEmpty()) {
                String firstImageUrl = productImages.get(0).getImageUrl(); // Hoặc thuộc tính tương ứng
                existingProduct.setThumbnail(firstImageUrl);
            } else {
                existingProduct.setThumbnail(null); // Hoặc giữ nguyên giá trị cũ
            }


            return productRepository.save(existingProduct);
        }
        return null;

    }

    @Override
    public void deleteProduct(long id) {
        Optional<Product> optionProduct = productRepository.findById(id);
        optionProduct.ifPresent(product -> {
            product.setActive(false); // Cập nhật trạng thái active thành false
            productRepository.save(product); // Lưu lại thay đổi vào cơ sở dữ liệu
        });
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    @Override
    public ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws Exception {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new DaTanotFoundException("cannot find product with id:" + productImageDTO.getProductId()));

        ProductImage newProductImage = ProductImage.builder()
                .product(existingProduct)
                .imageUrl(productImageDTO.getImageUrl())
                .build();
        // k cho insert qua 5 ảnh cho 1 sp
        int size = productImageReponsitory.findByProductId(productId).size();
        if (size >= ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
            throw new InvalidParamException("number or images must be <= " + ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
        }
        ProductImage savedProductImage = productImageReponsitory.save(newProductImage);

        // ** Cập nhật thumbnail nếu thumbnail của sản phẩm đang null **
        if (existingProduct.getThumbnail() == null || existingProduct.getThumbnail().isEmpty()) {
            existingProduct.setThumbnail(savedProductImage.getImageUrl());
            productRepository.save(existingProduct); // Lưu thay đổi vào DB
        }

        return savedProductImage;
    }

    @Override
    public List<Product> findProductsByIds(List<Long> productIds) {
        return productRepository.findProductsByIds(productIds);
    }

    @Override
    public List<Product> getAllProductss() {
        return productRepository.findActiveProducts();
    }

    public List<Product> getAll() {
        return productRepository.findAll(); // Lấy tất cả sản phẩm từ cơ sở dữ liệu
    }
}

