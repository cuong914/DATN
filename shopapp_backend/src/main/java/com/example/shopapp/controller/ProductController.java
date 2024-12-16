package com.example.shopapp.controller;

import com.example.shopapp.dtos.ProductDTO;

import com.example.shopapp.dtos.ProductImageDTO;
import com.example.shopapp.models.Product;
import com.example.shopapp.models.ProductImage;
import com.example.shopapp.response.ProductListResponse;
import com.example.shopapp.response.ProductResponse;
import com.example.shopapp.response.ResponseObject;
import com.example.shopapp.service.IProductService;
import com.example.shopapp.utils.LocallizationUtils;
import com.example.shopapp.utils.MessageKeys;
import com.github.javafaker.Faker;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.lang.module.ResolutionException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {
    private final IProductService productService;
    private final LocallizationUtils locallizationUtils;

    @PostMapping(value = "")
    public ResponseEntity<?> insertProduct(@Valid @RequestBody
                                                   ProductDTO productDTO,
                                           BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(fieldError -> fieldError.getDefaultMessage())
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Product newProduct = productService.createProduct(productDTO);
            return ResponseEntity.ok(newProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // upload anh
    @PostMapping(value = "uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(@PathVariable("id") Long productId,
                                          @ModelAttribute("files") List<MultipartFile> files) {
        try {
            Product existingProduct = productService.getProductById(productId);
            files = files == null ? new ArrayList<MultipartFile>() : files;
            if (files.size() > ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
                return ResponseEntity.badRequest().body(locallizationUtils.getLocallizeMessage(MessageKeys.UPLOAD_IMAGES_MAX_5));
            }
            List<ProductImage> productImages = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file.getSize() == 0) {
                    continue;
                }
                // kiểm tra kích thước file và định dạng
                if (file.getSize() > 20 * 2024 * 2024) { // kích thước file > 10mb
                    //  throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "file is too large");
                    // 2c đưa ra thông báo:
                    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                            .body(locallizationUtils.getLocallizeMessage(MessageKeys.UPLOAD_IMAGES_FILE_LARGE));
                }
                String contentType = file.getContentType();
                // getcontentType lấy ra định dạng file xem có phải file ảnh hay không
                if (contentType == null || !contentType.startsWith("image/")) {
                    // đoạn code kiểm tra xem contenttype đó có phải file ảnh hay k bằng cách nó có chứa image hay k
                    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                            .body( locallizationUtils.getLocallizeMessage(MessageKeys.UPLOAD_IMAGES_FILE_MUST_BE_IMAGE));
                }
                // lưu file và cập nhật thumbnanil trong dto
                String filename = storeFile(file);
                // lưu vào đối tượng product trong DB -> lm sau
                ProductImage productImage = productService.createProductImage(existingProduct.getId(), ProductImageDTO.builder()
                        .imageUrl(filename)
                        .build()
                );
                // luuw bang product_iamge
                productImages.add(productImage);
            }


            return ResponseEntity.ok().body(productImages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName) {
        try {
            java.nio.file.Path imagePath = Paths.get("uploads/"+imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(new UrlResource(Paths.get("uploads/notfound.jpg").toUri()));
                //return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


//        private String storeFile(MultipartFile file) throws IOException { // giá trị trả về là String 1 sâu kí tự là tên file đã lưu là cái MutiPartFile ở trên

    private String storeFile(MultipartFile file) throws IOException {
        if (!isImageFile(file) || file.getOriginalFilename() == null) {// kiem tra xem co phai image file k dong thoi khac null
            throw new
                    IOException("Invalid iamge format");
        }                                                                                              // vi bên trên đã chekc đk là file ảnh và null r
        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));    // nên bên dưới để requireNonNull
        // thêm UUID vào trước tên file để đảm bảo tên file là duy nhất
        String uniqueFilename = UUID.randomUUID().toString() + " " + filename;
        // đường dẫn thư mục bạn muốn lưu file
        Path uploadDir = Paths.get("uploads");
        //ktra  và tạo thư mục nếu k tồn tại
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        // lấy đường dẫn đến file đích
        Path destination = Paths.get(uploadDir.toString(), uniqueFilename);// Path nên build bằng nio
        // sao chép file vào thư mục đích
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING); // REPLACE_EXISTING nghĩa là nếu có sẽ thay thế
        return uniqueFilename;
    }

    //kiem tra xem co phai file anh k
    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    @GetMapping("")
    public ResponseEntity<ProductListResponse> getProducts(
            @RequestParam(defaultValue = "") String  keyword, // go cai j thi search theo cai do
            @RequestParam(defaultValue = "0",name = "category_id") Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int limit
    ) {

        int totalPages = 0;
        // tao pageable tu thong tin trang va gioi han
        PageRequest pageRequest = PageRequest.of(page, limit
               , Sort.by("createAt").descending());
//                // sap xep theo thu tu giam dan (tu moi -> cu)
               //    , Sort.by("id").ascending()); // sắp xêps theo id tăng dần
        Page<ProductResponse> productPage = productService.getAllProducts(keyword, categoryId,pageRequest);
        // lay tong so trang
        totalPages = productPage.getTotalPages();// getTotalPages co san chir vc goi ra sd
        List<ProductResponse> products = productPage.getContent();//lay danh sach product
        return ResponseEntity.ok(ProductListResponse.builder()
                .products(products)
                .totalPage(totalPages)
                .build());
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ProductResponse>> getAll() throws Exception {
        List<Product> products = productService.getAllProductss(); // Lấy tất cả sản phẩm
        List<ProductResponse> productResponses = products.stream()
                .map(ProductResponse::fromProduct) // Chuyển đổi danh sách Product thành ProductResponse
                .collect(Collectors.toList());
        return ResponseEntity.ok(productResponses); // Trả về danh sách ProductResponse
    }

    @GetMapping("/{id}")//ResponEntiry<?> cái ? là kiểu nhận nh dữ liệu thì sd hỏi chấm
    public ResponseEntity<?> getProductId(@PathVariable("id") Long productId) {
        try {
            Product existingProduct = productService.getProductById(productId);
            return ResponseEntity.ok(ProductResponse.fromProduct(existingProduct));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/prs/{id}")
    public ResponseEntity<ResponseObject> getProductByIds(
            @PathVariable("id") Long productId
    ) throws Exception {
        Product existingProduct = productService.getProductById(productId);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(ProductResponse.fromProduct(existingProduct))
                .message("Get detail product successfully")
                .status(HttpStatus.OK)
                .build());

    }



    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProductId(@PathVariable("id") Long id) {

            productService.deleteProduct(id);
            return ResponseEntity.ok(ResponseObject.builder()
                    .data(null)
                    .message(String.format("Product with id = %d deleted successfully", id))
                    .status(HttpStatus.OK)
                    .build());


    }
    @GetMapping("/by-ids")
    public ResponseEntity<?> getProductsByIds(@RequestParam("ids") String ids) {
        //eg: 1,3,5,7
        try {
            // Tách chuỗi ids thành một mảng các số nguyên
            List<Long> productIds = Arrays.stream(ids.split(","))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
            List<Product> products = productService.findProductsByIds(productIds);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


//    @PostMapping("/generateFakeProducts")
    public ResponseEntity<String> generateFakeProduct() {
        Faker faker = new Faker();//fake dữ liệu
        for (int i = 0; i < 1_000; i++) {
            String productName = faker.commerce().productName();
            if (productService.existsByName(productName)) {
                continue;
            }
            ProductDTO productDTO = ProductDTO.builder()
                    .name(productName)
                    .price((float) faker.number().numberBetween(10, 90_000_000))// các hàm để faker dữ liệu
                    .description(faker.lorem().sentence())
                    .thumbnail("")
                    .categoryId((long) faker.number().numberBetween(2, 5))
                    .build();
            try {
                productService.createProduct(productDTO);// vì phàn này ném ra 1 exception nên đưa nó vao try catch
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        return ResponseEntity.ok("Fake Products created successfullly");

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable long id, @RequestBody ProductDTO productDTO) {

        try {
            Product updateProduct = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(updateProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }
}
