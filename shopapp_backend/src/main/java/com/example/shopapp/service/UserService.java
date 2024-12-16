package com.example.shopapp.service;

import com.example.shopapp.componemts.JwtTokenUtil;
import com.example.shopapp.dtos.UpdateUserDTO;
import com.example.shopapp.dtos.UserDTO;
import com.example.shopapp.exception.DaTanotFoundException;
import com.example.shopapp.exception.PeremissionDenyException;
import com.example.shopapp.models.Role;
import com.example.shopapp.models.User;
import com.example.shopapp.repositorys.RoleRepository;
import com.example.shopapp.repositorys.UserRepository;
import com.example.shopapp.utils.LocallizationUtils;
import com.example.shopapp.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final LocallizationUtils locallizationUtils;

    @Override
    public User create(UserDTO userDTO) throws Exception {
        String phoneNumber = userDTO.getPhoneNumber();
        //kiểm tra xem sdt này tồn tại hayy chưa

        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DataIntegrityViolationException("phone number already exists");
        }
        Role role = roleRepository.findById(userDTO.getRoleId()) // kiểm tra role
                .orElseThrow(() -> new DaTanotFoundException("Role not found"));
        if(role.getName().toUpperCase().equals(Role.ADMIN)){
            throw new PeremissionDenyException("you can register a admin acount");
        }

        // convert tuwf userdto sag user
        User newUser = User.builder()
                .fullName(userDTO.getFullName())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())// do đây là tạo mơi user nen sẽ có password
                .address(userDTO.getAddress())
                .dateOfBirth(userDTO.getDateOfBirth())
                .facebookAccountId(userDTO.getFacebookAccountId())
                .googleAccountId(userDTO.getGoogleAccountId())
                .build();

        newUser.setRole(role);
        // kiểm tra xem nếu có accountId , khôn gyêu câu passw
        if (userDTO.getFacebookAccountId() == 0 && userDTO.getGoogleAccountId() == 0) {
            String password = userDTO.getPassword();
            String encodePassword = passwordEncoder.encode(password);
            newUser.setPassword(encodePassword);
        }

        return userRepository.save(newUser);
    }

    @Override
    public String login(String phoneNumber, String password,Long roleId) throws Exception {
        // do
//        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
//        if (optionalUser.isEmpty()) {
//            throw new DaTanotFoundException(locallizationUtils.getLocallizeMessage(MessageKeys.WRONG_PHONE_PASSWORD));
//        }
//        // return optionalUser.get();// muốn trả về jwt toekn
//        User existingUser = optionalUser.get();
//        // kiểm tra mk . với hệ thống của ta xem mk ok chưa trừ đăng nhập gg && fa thì ta mới phaỉ ktra passw
//        if (existingUser.getFacebookAccountId() == 0 && existingUser.getGoogleAccountId() == 0) { // k phải đăng nhập bằng gg và fa thì mưới phải ktra  nếu đăng nhập = gg , fa thì thôi
//            if (!passwordEncoder.matches(password, existingUser.getPassword())) {// check xem mk đã mã hóa có = trong đối tượng user hay k
//                throw new BadCredentialsException(locallizationUtils.getLocallizeMessage(MessageKeys.WRONG_PHONE_PASSWORD)); //k trùng nahu ném ra lỗi này
//            }
//        }
//        Optional<Role> optionalRole = roleRepository.findById(roleId);
//        if(optionalRole.isEmpty() || !roleId.equals(existingUser.getRole().getId())) {
//            throw new DaTanotFoundException(locallizationUtils.getLocallizeMessage(MessageKeys.ROLE_DOES_NOT_EXISTS));
//        }
//        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
//                phoneNumber, password, existingUser.getAuthorities()
//
//        );
//        // authenticate with java spring security
//        authenticationManager.authenticate(authenticationToken);// ta truyền vào đối tượng  authenticationManger dưới dạng username(phonenumber) và password vậy nên ta cần tạo UsernamePasswordAuthenticationToken
//        return jwtTokenUtil.genrateToken(existingUser);
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if(optionalUser.isEmpty()) {
            throw new DaTanotFoundException(locallizationUtils.getLocallizeMessage(MessageKeys.WRONG_PHONE_PASSWORD));
        }
        //return optionalUser.get();//muốn trả JWT token ?
        User existingUser = optionalUser.get();
        //check password
        if (existingUser.getFacebookAccountId() == 0
                && existingUser.getGoogleAccountId() == 0) {
            if(!passwordEncoder.matches(password, existingUser.getPassword())) {
                throw new BadCredentialsException(locallizationUtils.getLocallizeMessage(MessageKeys.WRONG_PHONE_PASSWORD));
            }
        }
        Optional<Role> optionalRole = roleRepository.findById(roleId);
        if(optionalRole.isEmpty() || !roleId.equals(existingUser.getRole().getId())) {
            throw new DaTanotFoundException(locallizationUtils.getLocallizeMessage(MessageKeys.ROLE_DOES_NOT_EXISTS));
        }
        if(optionalUser.get().isActive()) {
            throw new DaTanotFoundException(locallizationUtils.getLocallizeMessage(MessageKeys.USER_IS_LOCKED));
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                phoneNumber, password,
                existingUser.getAuthorities()
        );

        //authenticate with Java Spring security
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtil.genrateToken(existingUser);

    }

    @Override
    public User getUserDetailsFromToken(String token) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new Exception("Token is expired");
        }
        String phoneNumber = jwtTokenUtil.extracPhoneNumber(token);
        Optional<User> user = userRepository.findByPhoneNumber(phoneNumber);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new Exception("User not found");
        }
    }

    @Override
    public User updateUser(Long userId, UpdateUserDTO updatedUserDTO) throws Exception {
        // Find the existing user by userId
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new DaTanotFoundException("User not found"));

        // Check if the phone number is being changed and if it already exists for another user
        String newPhoneNumber = updatedUserDTO.getPhoneNumber();
        if (!existingUser.getPhoneNumber().equals(newPhoneNumber) &&
                userRepository.existsByPhoneNumber(newPhoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }

        // Update user information based on the DTO
        if (updatedUserDTO.getFullName() != null) {
            existingUser.setFullName(updatedUserDTO.getFullName());
        }
        if (newPhoneNumber != null) {
            existingUser.setPhoneNumber(newPhoneNumber);
        }
        if (updatedUserDTO.getAddress() != null) {
            existingUser.setAddress(updatedUserDTO.getAddress());
        }
        if (updatedUserDTO.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(updatedUserDTO.getDateOfBirth());
        }
        if (updatedUserDTO.getFacebookAccountId() > 0) {
            existingUser.setFacebookAccountId(updatedUserDTO.getFacebookAccountId());
        }
        if (updatedUserDTO.getGoogleAccountId() > 0) {
            existingUser.setGoogleAccountId(updatedUserDTO.getGoogleAccountId());
        }

        // Update the password if it is provided in the DTO
        if (updatedUserDTO.getPassword() != null
                && !updatedUserDTO.getPassword().isEmpty()) {
            if(!updatedUserDTO.getPassword().equals(updatedUserDTO.getRetypePassword())){
                throw new DaTanotFoundException("password and retype password not the same");
            }
            String newPassword = updatedUserDTO.getPassword();
            String encodedPassword = passwordEncoder.encode(newPassword);
            existingUser.setPassword(encodedPassword);
        }
        //existingUser.setRole(updatedRole);
        // Save the updated user
        return userRepository.save(existingUser);
    }



}