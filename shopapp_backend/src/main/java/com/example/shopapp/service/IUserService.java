package com.example.shopapp.service;

import com.example.shopapp.dtos.UpdateUserDTO;
import com.example.shopapp.dtos.UserDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.models.User;

public interface IUserService {
    User create(UserDTO userDTO) throws Exception; // tạo user mới khi đang ký

     String login(String phoneNumber, String password) throws Exception;// để string vì nó trả về 1 token key chuỗi ký tự mã joas

    User getUserDetailsFromToken(String token) throws Exception;
    User updateUser(Long userId, UpdateUserDTO updatedUserDTO) throws Exception;

}
