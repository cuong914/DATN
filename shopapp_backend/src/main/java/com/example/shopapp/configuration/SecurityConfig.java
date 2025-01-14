package com.example.shopapp.configuration;

import com.example.shopapp.repositorys.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserRepository userRepository;
    //n khởi tạo đối tượng user detail object
    /// là 1 đối tượng user theo chuẩn của java swing
    // khi đăng nhập vào hệ thống nó phải qua đối tượng đố
    //và quàn lý đăng nhập thống qua đối tượng userdetail object
    // nên cái đối tượng user của t  lámf sao cho nó cònig với cái user của jvava swing
    // thì lúc đố ta mới sử dụng đc cái phần auth, đăng nhập tức là các
    // request sau gửi kèm token sẽ đc đăng nhập k phải nhập lại password nữa



    @Bean
    public UserDetailsService userDetailsService() {// nó là 1 interface nên giá trị trả về là
        // 1 funcion nên giá trị trả về là 1 biếu thức lamda
        return phoneNumber -> userRepository.findByPhoneNumber(phoneNumber)  // kiểm tra xem có sdt này k
                .orElseThrow(() -> new UsernameNotFoundException("cannot find user with phoneNumber"+ phoneNumber));


        //c2
//        return phoneNumber ->{
//            User existingUser =  userRepository.findByPhoneNumber(phoneNumber)  // kiểm tra xem có sdt này k
//                    .orElseThrow(() -> new  UsernameNotFoundException("cannot find user with phoneNumber"));
//            return existingUser;
//        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();// cái methodd BCryptPasswordEncoder đã thực thi các method r k cần

    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
