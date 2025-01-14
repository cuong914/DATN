package com.example.shopapp.controller;

import com.example.shopapp.dtos.SizeDTO;
import com.example.shopapp.models.Size;
import com.example.shopapp.response.ResponseObject;
import com.example.shopapp.service.SizeService;
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

// dependency injection
@RequiredArgsConstructor
//@Validated
@RestController
@RequestMapping("${api.prefix}/sizes")
// v1,2, chia ra các version 3 để có thể khi sử dụng vr1 thì vr 2,3 vẫn họat động
public class SizeController {
    private final SizeService sizeService;
    private final LocaleResolver localeResolver;
    private final MessageSource messageSource;
    private final LocallizationUtils locallizationUtils;

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getSizeById(@PathVariable Long id) {
        try {
            Size size = sizeService.getSizeById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .status(HttpStatus.OK)
                            .data(size)
                            .message("Lấy thông tin kích thước thành công")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.NOT_FOUND)
                            .message("Không tìm thấy kích thước với id: " + id)
                            .build());
        }
    }
    @PostMapping("")
    // mếu tham số truyền vào là 1 đối tượng (object) => gọi là transfer object = request object
    // ResponseEntity<?> nếu kiểu dữ liệu trả về là cả list và string thì đặt là ? k thì để nguyên là string
    public ResponseEntity<?> creatSize(
            @Valid @RequestBody SizeDTO sizeDTO,
            BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()// đây là phần lấy ra thông báo lỗi mong muốn
                    .stream() // sử dụng stream duyệt qua tất cả và chỉ lấy 1 trg nào đó và ánh sạ sang 1 mảng khác
                    .map(FieldError::getDefaultMessage) // hàm ánh xạ với đối tượng là từng fielderror
                    .toList();                          // lấy tất cả thông  báo mà không thêm bớt chỉnh sửa j
            return ResponseEntity.badRequest().body(errorMessages);
        }
        sizeService.createSize(sizeDTO);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message(" size successfully")
                        .build());
    }

    // hiển thị tất cả
    @GetMapping("") // là phương thức trả về từ phía web ng dùngInsert
    //
    public ResponseEntity<List<Size>> getAllSizes(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit
    ) {
        List<Size> sizes = sizeService.getAllSizes();
        return ResponseEntity.ok(sizes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateSize(@PathVariable Long id,
                                                         @Valid @RequestBody SizeDTO sizeDTO,
                                                         HttpServletRequest request) {

        sizeService.updateSize(id, sizeDTO);
//        Locale locale = localeResolver.resolveLocale(request);
        return ResponseEntity.ok(ResponseObject
                .builder()
                .data(sizeService.getSizeById(id))
                .message(locallizationUtils.getLocallizeMessage(MessageKeys.UPDATE_CATEGORY_SUCCESSFULLY))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteSize(@PathVariable Long id) {
        sizeService.deleteSize(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete Size successfully")
                        .build());
    }

}
