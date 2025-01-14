package com.example.shopapp.Filters;

import com.example.shopapp.componemts.JwtTokenUtil;
import com.example.shopapp.models.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.ServletException;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Component
public class JwtTokenFilter extends OncePerRequestFilter { //// mỗi reques đều phải đi qua thg này để kiểm tra (trừ request login vs  dky  k ktra còn nhg cái khác hầu như  kltra
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    @Value("${api.prefix}")
    private String apiPrefix;
    @Override
    // @Notnull là để tránh trường hợp bị truyền vào giá trị rỗng hây ra lỗi exception / runtine - > nếu null sẽ k tiếp tục sử lý  request/ gửi response cho ng dùng  (bắt buộc)
    protected void doFilterInternal(@NonNull HttpServletRequest request, // cho pheps chúng ta như thế nào thì cho đi qua
                                    @NonNull HttpServletResponse response, // như thế nào thì phải kiểm tra
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            if (isByPassToken(request)) { // k yêu cấu token vânx cho đi qua
                filterChain.doFilter(request, response);
                return;// cho đi qua luôn k ktra nữa
            }
            // đây sẽ là chỗ krtra . toàn bộ những thàng nào mà cần token thì bên postman pahri cần sd  chèn thêm thằng header vòa
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null  || !authHeader.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unanthorized");
                return;
            }// trong trường hợp này nó chưa authentica thì nó sẽ lấy đối tượng detail ra  // và nó kiẻmr tra xem là cái token mà ta đưa vào nó đã hợp lệ chưa ,(có phải ng đó đăng nhập hya k )                                                 // trong trường hợp này nó chưa authentica thì nó sẽ lấy đối tượng detail ra  // và nó kiẻmr tra xem là cái token mà ta đưa vào nó đã hợp lệ chưa ,(có phải ng đó đăng nhập hya k )
            final String token = authHeader.substring(7);
            final String phoneNumber = jwtTokenUtil.extracPhoneNumber(token);
            if (phoneNumber != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                User userDetails = (User) userDetailsService.loadUserByUsername(phoneNumber); // do cái user của ta ké thừa và thực thi phương thức UserDetails nên ta hoàn toàn ép kiểu đc
                if (jwtTokenUtil.validateToken(token, userDetails)) { // kiểm tra jwttoken  . nếu trả về là true
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(  // authentica với hệ thống của java spring
                                    userDetails, null,
                                    userDetails.getAuthorities()
                            );
                    // xét authentication token
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
            // chekc token sog hết cho đi qua(đây là request yêu cầu token )
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unanthorized");
        }


    }


    private boolean isByPassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> bypassTokens = Arrays.asList(// danh sách các rquest đi qua mà ai cx xem đc
                Pair.of(String.format("%s/roles",apiPrefix), "GET"),
//                Pair.of(String.format("%s/orders",apiPrefix), "GET"),
                Pair.of(String.format("%s/products", apiPrefix),"GET"),
                Pair.of(String.format("%s/statistics/**", apiPrefix),"GET"),
                Pair.of(String.format("%s/orders/pending", apiPrefix), "GET"), // Thêm dòng này
                Pair.of(String.format("%s/orders/get-orders-by-keyword", apiPrefix), "GET"),
                Pair.of(String.format("%s/orders/vnpay-payment/**", apiPrefix),"GET"),
                Pair.of(String.format("%s/counter-orders/create", apiPrefix), "POST"),
                Pair.of(String.format("%s/categories", apiPrefix), "GET"),
                Pair.of(String.format("%s/order_details/cancel", apiPrefix), "PUT"),
                Pair.of(String.format("%s/users/register", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/login", apiPrefix), "POST")

        );

        String requestPath = request.getServletPath();
        String requestMethod = request.getMethod();


        for (Pair<String, String> bypassToken : bypassTokens) {
            if (requestPath.contains(bypassToken.getFirst()) && requestMethod.equals(bypassToken.getSecond())) {
                return true;
            }
        }

        if (requestPath.startsWith(String.format("%s/statistics", apiPrefix))) {
            return true;
        }

        if (requestPath.contains("/orders/vnpay-payment") && requestMethod.equals("GET")) {
            // Allow access to /orders/vnpay-payment
            return true;
        }
        if (requestPath.startsWith(String.format("%s/order_details", apiPrefix))
                && requestMethod.equals("PUT")) {
            return true;
        }



        if (requestPath.equals(String.format("%s/orders/**", apiPrefix))
                && requestMethod.equals("GET")) {
            // Allow access to %s/orders
            return true;
        }

        for (Pair<String, String> bypassToken : bypassTokens) {
            if (requestPath.contains(bypassToken.getFirst())
                    && requestMethod.equals(bypassToken.getSecond())) {
                return true;
            }
        }
        return false;
    }

}

// 41