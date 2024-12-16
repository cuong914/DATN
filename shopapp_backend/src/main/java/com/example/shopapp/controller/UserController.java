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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
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
    public ResponseEntity<RegisterResponse> createUser(
            @Valid @RequestBody UserDTO userDTO,
            BindingResult result
    ) {
        RegisterResponse registerResponse = new RegisterResponse();
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(fieldError -> fieldError.getDefaultMessage())
                        .toList();
                registerResponse.setMessage(errorMessages.toString());
                return ResponseEntity.badRequest().body(registerResponse);
            }
            if (!userDTO.getPassword().equals(userDTO.getRetypePassword())) {
                registerResponse.setMessage(locallizationUtils.getLocallizeMessage(MessageKeys.PASSWORD_NOT_MATCH));
                return ResponseEntity.badRequest().body(registerResponse);
            }
            User user = userService.create(userDTO);
            //return ResponseEntity.ok("register successfully");
            registerResponse.setMessage(locallizationUtils.getLocallizeMessage(MessageKeys.REGISTER_SUCCESSFULLY));
            registerResponse.setUser(user);
            return ResponseEntity.ok(registerResponse);
        } catch (Exception e) {
            registerResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(registerResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody UserLoginDTO userLoginDTO
          ) {
        // kiểm tra thông tin đăng nhập và sinh token
        try {
            String token = userService.login(
                    userLoginDTO.getPhoneNumber(),
                    userLoginDTO.getPassword(),
                    userLoginDTO.getRoleId() == null ? 1 : userLoginDTO.getRoleId()
            );

            return ResponseEntity.ok(LoginResponse.builder()                                                    // đoạn này là yêu cầu trả về thông báo
                    .message(locallizationUtils.getLocallizeMessage(MessageKeys.LOGIN_SUCCESSFULLY))    //  = tiếng anh hoặc tiếng vvieetj
                    .token(token)                                                                                //
                    .build()
              );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message(locallizationUtils.getLocallizeMessage(MessageKeys.LOGIN_FAILED,e.getMessage()))
                            .build()
            );
            // throw new RuntimeException(e);
        }
        // trả và token trong response

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
