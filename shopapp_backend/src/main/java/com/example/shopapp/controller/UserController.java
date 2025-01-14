package com.example.shopapp.controller;

import com.example.shopapp.dtos.UpdateUserDTO;
import com.example.shopapp.dtos.UserDTO;
import com.example.shopapp.dtos.UserLoginDTO;
import com.example.shopapp.models.User;
import com.example.shopapp.response.LoginResponse;
import com.example.shopapp.response.OrderListResponse;
import com.example.shopapp.response.OrderResponse;
import com.example.shopapp.response.RegisterResponse;
import com.example.shopapp.response.UserResponse;
import com.example.shopapp.service.IUserService;
import com.example.shopapp.utils.LocallizationUtils;
import com.example.shopapp.utils.MessageKeys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.LocaleResolver;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final LocallizationUtils locallizationUtils;
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(
            @Valid @RequestBody UserDTO userDTO,
            BindingResult result
    ) {
        RegisterResponse response = new RegisterResponse();
        try {
            // Xử lý lỗi đầu vào
            if (result.hasErrors()) {
                List<String> errors = result.getFieldErrors()
                        .stream()
                        .map(fieldError -> fieldError.getDefaultMessage())
                        .toList();
                response.setMessage(String.join(", ", errors));
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);  // 422 Unprocessable Entity
            }

            // Đăng ký tài khoản
            User user = userService.create(userDTO);
            response.setMessage("Đăng ký tài khoản thành công!");
            response.setUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);  // 201 Created

        } catch (DataIntegrityViolationException e) {
            // Lỗi vi phạm ràng buộc cơ sở dữ liệu (ví dụ: số điện thoại đã tồn tại)
            response.setMessage("Lỗi: Số điện thoại đã tồn tại");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);  // 409 Conflict
        } catch (Exception e) {
            response.setMessage("Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);  // 500 Internal Server Error
        }
    }


    // Đăng nhập người dùng (KHÔNG cần role_id)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody UserLoginDTO userLoginDTO) {
        try {
            // Xác thực và tạo token
            String token = userService.login(
                    userLoginDTO.getPhoneNumber(),
                    userLoginDTO.getPassword()
            );

            // Lấy thông tin người dùng từ token
            User user = userService.getUserDetailsFromToken(token);

            // Trả về thông tin đăng nhập bao gồm cả role
            return ResponseEntity.ok(LoginResponse.builder()
                    .message(locallizationUtils.getLocallizeMessage(MessageKeys.LOGIN_SUCCESSFULLY))
                    .token(token)
                    .role(user.getRole().getName())
                    .build());
        } catch (Exception e) {
            throw new BadCredentialsException(locallizationUtils.getLocallizeMessage(
                    MessageKeys.LOGIN_FAILED, e.getMessage()));
        }
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<LoginResponse> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(LoginResponse.builder()
                .message(e.getMessage())
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<LoginResponse> handleGeneralException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(LoginResponse.builder()
                .message("Internal server error: " + e.getMessage())
                .build());
    }
    @PostMapping("/details")
    public ResponseEntity<UserResponse> getUserDetails(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            String extractedToken = authorizationHeader.substring(7); // Loại bỏ "Bearer " từ chuỗi token
            User user = userService.getUserDetailsFromToken(extractedToken);
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/details/{userId}")
    public ResponseEntity<UserResponse> updateUserDetails(
            @PathVariable Long userId,
            @RequestBody UpdateUserDTO updatedUserDTO,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            String extractedToken = authorizationHeader.substring(7);
            User user = userService.getUserDetailsFromToken(extractedToken);
            // Ensure that the user making the request matches the user being updated
            if (user.getId() != userId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            User updatedUser = userService.updateUser(userId, updatedUserDTO);
            return ResponseEntity.ok(UserResponse.fromUser(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


}
