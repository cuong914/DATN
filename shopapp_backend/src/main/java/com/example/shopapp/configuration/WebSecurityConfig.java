package com.example.shopapp.configuration;


import com.example.shopapp.Filters.JwtTokenFilter;
import com.example.shopapp.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;




import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    @Value("${api.prefix}")
    private String apiPrefix;
    private final JwtTokenFilter jwtTokenFilter;
    @Bean  //  khi request guửi đến  thì kiểm trả xem nó có quyền gì thì mới đc cho vào hệ thống
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)  // đoạn này check kiểm tra xem có cho request này đi qua k mà k cần token hay k
                .authorizeHttpRequests(request -> {
                    request.requestMatchers(
                            String.format("/orders/vnpay-payment/**",apiPrefix),
                                String.format("%s/users/register",apiPrefix),
                                String.format("%s/users/login",apiPrefix),
                            String.format("%s/roles",apiPrefix)

                    )
                            .permitAll()

                            .requestMatchers(GET,
                                    String.format("%s/users/login", apiPrefix)).permitAll()


                            .requestMatchers(GET,
                                    String.format("%s/coupons/calculate/**", apiPrefix)).hasAnyRole(Role.USER)



                            .requestMatchers(POST,
                                    String.format("%s/users/details", apiPrefix)).permitAll()



                            .requestMatchers(GET,
                                    String.format("%s/roles**", apiPrefix)).permitAll()



                            .requestMatchers(GET,
                                    String.format("%s/categories/**", apiPrefix)).permitAll()
                            .requestMatchers(GET,
                                    String.format("%s/categories**", apiPrefix)).permitAll()

                            .requestMatchers(POST,
                                    String.format("%s/categories/**", apiPrefix)).hasAnyRole(Role.ADMIN)

                            .requestMatchers(PUT,
                                    String.format("%s/categories/**", apiPrefix)).hasAnyRole(Role.ADMIN)

                            .requestMatchers(DELETE,
                                    String.format("%s/categories/**", apiPrefix)).hasAnyRole(Role.ADMIN)

                            .requestMatchers(GET,
                                    String.format("%s/products**", apiPrefix)).permitAll()

                            .requestMatchers(GET,
                                    String.format("%s/products/**", apiPrefix)).permitAll()

                            .requestMatchers(GET,
                                    String.format("%s/products/images/*", apiPrefix)).permitAll()

                            .requestMatchers(POST,
                                    String.format("%s/products/**", apiPrefix)).hasAnyRole(Role.ADMIN)

                            .requestMatchers(PUT,
                                    String.format("%s/products/**", apiPrefix)).hasAnyRole(Role.ADMIN)

                            .requestMatchers(DELETE,
                                    String.format("%s/products/**", apiPrefix)).hasAnyRole(Role.ADMIN)


                            .requestMatchers(POST,
                                    String.format("%s/orders/**", apiPrefix)).hasAnyRole(Role.USER)

                            .requestMatchers(GET,
                                    String.format("%s/orders/**", apiPrefix)).permitAll()

//                            .requestMatchers(GET,
//                                    String.format("%s/orders/get-orders-by-keyword", apiPrefix)).hasAnyRole(Role.ADMIN)

                            .requestMatchers(PUT,
                                    String.format("%s/orders/**", apiPrefix)).hasRole(Role.ADMIN)

                            .requestMatchers(DELETE,
                                    String.format("%s/orders/**", apiPrefix)).hasRole(Role.ADMIN)

                            .requestMatchers(POST,
                                    String.format("%s/order_details/**", apiPrefix)).hasAnyRole(Role.USER)

                            .requestMatchers(GET,
                                    String.format("%s/order_details/**", apiPrefix)).permitAll()

                            .requestMatchers(PUT,
                                    String.format("%s/order_details/**", apiPrefix)).hasRole(Role.ADMIN)

                            .requestMatchers(DELETE,
                                    String.format("%s/order_details/**", apiPrefix)).hasRole(Role.ADMIN)


//
                            .anyRequest().authenticated();
                })
        .csrf(AbstractHttpConfigurer :: disable);
//        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() { // cho phep serve tiep nhanj request tu nguon k dang tin cay
//            @Override
//            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
//            CorsConfiguration corsConfiguration = new CorsConfiguration();
//            corsConfiguration.setAllowedOrigins(List.of("*"));
//            corsConfiguration.setAllowedMethods(Arrays.asList("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
//            corsConfiguration.setAllowedMethods(Arrays.asList("authorization","content-type","x-auth-token"));
//            corsConfiguration.setExposedHeaders(List.of("x-auth-token"));
//                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//                source.registerCorsConfiguration("/**",corsConfiguration);
//
//                httpSecurityCorsConfigurer.configurationSource(source);
//
//            }
//        });
        http.cors(cors -> {
            CorsConfiguration corsConfiguration = new CorsConfiguration();
            corsConfiguration.setAllowedOrigins(List.of("*"));
            corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
            corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-Auth-Token"));
            corsConfiguration.setExposedHeaders(List.of("X-Auth-Token"));

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", corsConfiguration);

            cors.configurationSource(source);
        });


        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:4200")
                 .allowedOrigins("http://localhost:4200/vnpay-payment")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
