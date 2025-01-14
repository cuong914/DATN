package com.example.shopapp.controller;

import com.example.shopapp.dtos.ColorDTO;
import com.example.shopapp.models.Color;
import com.example.shopapp.response.ResponseObject;
import com.example.shopapp.service.ColorService;
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
@RequestMapping("${api.prefix}/colors")
// v1,2, chia ra các version 3 để có thể khi sử dụng vr1 thì vr 2,3 vẫn họat động
public class ColorController {
    private final ColorService colorService;
    private final LocaleResolver localeResolver;
    private final MessageSource messageSource;
    private final LocallizationUtils locallizationUtils;

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getSizeById(@PathVariable Long id) {
        try {
            Color color = colorService.getColorById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .status(HttpStatus.OK)
                            .data(color)
                            .message("Lấy thông tin color thành công")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.NOT_FOUND)
                            .message("Không tìm thấy color với id: " + id)
                            .build());
        }
    }
    @PostMapping("")
    // mếu tham số truyền vào là 1 đối tượng (object) => gọi là transfer object = request object
    // ResponseEntity<?> nếu kiểu dữ liệu trả về là cả list và string thì đặt là ? k thì để nguyên là string
    public ResponseEntity<?> creatColor(
            @Valid @RequestBody ColorDTO colorDTO,
            BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()// đây là phần lấy ra thông báo lỗi mong muốn
                    .stream() // sử dụng stream duyệt qua tất cả và chỉ lấy 1 trg nào đó và ánh sạ sang 1 mảng khác
                    .map(FieldError::getDefaultMessage) // hàm ánh xạ với đối tượng là từng fielderror
                    .toList();                          // lấy tất cả thông  báo mà không thêm bớt chỉnh sửa j
            return ResponseEntity.badRequest().body(errorMessages);
        }
        colorService.createColor(colorDTO);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message(" Color successfully")
                        .build());
    }

    // hiển thị tất cả
    @GetMapping("") // là phương thức trả về từ phía web ng dùngInsert
    //
    public ResponseEntity<List<Color>> getAllColors(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit
    ) {
        List<Color> colors = colorService.getAllColors();
        return ResponseEntity.ok(colors);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateSize(@PathVariable Long id,
                                                     @Valid @RequestBody ColorDTO colorDTO,
                                                     HttpServletRequest request) {

        colorService.updateColor(id, colorDTO);
//        Locale locale = localeResolver.resolveLocale(request);
        return ResponseEntity.ok(ResponseObject
                .builder()
                .data(colorService.getColorById(id))
                .message(locallizationUtils.getLocallizeMessage(MessageKeys.UPDATE_CATEGORY_SUCCESSFULLY))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteSize(@PathVariable Long id) {
        colorService.deleteColor(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete Color successfully")
                        .build());
    }

}
