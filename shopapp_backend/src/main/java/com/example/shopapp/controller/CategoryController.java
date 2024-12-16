package com.example.shopapp.controller;


import com.example.shopapp.dtos.CategoryDTO;
import com.example.shopapp.models.Category;
import com.example.shopapp.repositorys.CategoryRepository;
import com.example.shopapp.response.ResponseObject;
import com.example.shopapp.response.UpdateCategoryResponse;
import com.example.shopapp.service.CategoryService;
import com.example.shopapp.utils.LocallizationUtils;
import com.example.shopapp.utils.MessageKeys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.LocaleResolver;

import java.util.List;
import java.util.Locale;

// dependency injection
@RequiredArgsConstructor
//@Validated
@RestController
@RequestMapping("${api.prefix}/categories")
// v1,2, chia ra các version 3 để có thể khi sử dụng vr1 thì vr 2,3 vẫn họat động
public class CategoryController {
    private final CategoryService categoryService;
    private final LocaleResolver localeResolver;
    private final MessageSource messageSource;
    private final LocallizationUtils locallizationUtils;

    @PostMapping("")
    // mếu tham số truyền vào là 1 đối tượng (object) => gọi là transfer object = request object
    // ResponseEntity<?> nếu kiểu dữ liệu trả về là cả list và string thì đặt là ? k thì để nguyên là string
    public ResponseEntity<?> creatCategory(
            @Valid @RequestBody CategoryDTO categoryDTO,
            BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()// đây là phần lấy ra thông báo lỗi mong muốn
                    .stream() // sử dụng stream duyệt qua tất cả và chỉ lấy 1 trg nào đó và ánh sạ sang 1 mảng khác
                    .map(FieldError::getDefaultMessage) // hàm ánh xạ với đối tượng là từng fielderror
                    .toList();                          // lấy tất cả thông  báo mà không thêm bớt chỉnh sửa j
            return ResponseEntity.badRequest().body(errorMessages);
        }
        categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message(" category successfully")
                        .build());
    }

    // hiển thị tất cả
    @GetMapping("") // là phương thức trả về từ phía web ng dùngInsert
    //
    public ResponseEntity<List<Category>> getAllCategories(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit
    ) {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateCategory(@PathVariable Long id,
                                                                 @Valid @RequestBody CategoryDTO categoryDTO,
                                                                 HttpServletRequest request) {

        categoryService.updateCategory(id, categoryDTO);
//        Locale locale = localeResolver.resolveLocale(request);
        return ResponseEntity.ok(ResponseObject
                .builder()
                .data(categoryService.getCategoryById(id))
                .message(locallizationUtils.getLocallizeMessage(MessageKeys.UPDATE_CATEGORY_SUCCESSFULLY))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete category successfully")
                        .build());
    }

}
