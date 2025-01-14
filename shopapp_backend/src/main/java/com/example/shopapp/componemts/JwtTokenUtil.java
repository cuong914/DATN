package com.example.shopapp.componemts;

import com.example.shopapp.exception.InvalidParamException;
import com.example.shopapp.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor

public class JwtTokenUtil {// ra hạn thời gian token có hiệu lực
    @Value("${jwt.expiration}")
    private int expiration;// save to an environment vảiable
    @Value("${jwt.secretKey}")
    private String secretKey;

    public String genrateToken(User user) throws Exception {

        // lấy user trong dự án của mi mình
        // propertion -> claim
        Map<String, Object> claim = new HashMap<>(); // do có thể phát sinh lỗi nên để vào truy catch để bắt lỗi
//    this.genrateSecretKey(); // kiểm tra xem cái securetKey có gen đc k hay k
        claim.put("phoneNumber", user.getPhoneNumber());
        claim.put("userId", user.getId());
        if (user.getRole() != null) {
            claim.put("role", user.getRole().getName());
        } else {
            claim.put("role", "USER"); // Mặc định role USER nếu không có
        }
        // đoạn này đang chuẩn hóa đối tượng user của chúng ta sang user của spring security
        try {
            String token = Jwts.builder()
                    .setClaims(claim) //làm thế nào để trích xuất   ra các claim tứ đây
                    .setSubject(user.getPhoneNumber())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L)) // tính ố thời gian tồn tại của tokenL
                    .signWith(getSignKey(), SignatureAlgorithm.HS256)                                                       // 1000 là đổi từ giây ra miligiaya
                    .compact();
            return token;
        } catch (Exception e) {
            //  you can use inject logger , intead(System.out.println
            throw new InvalidParamException("Cannot create jwt token , eror" + e.getMessage());
            // return  null;
        }
    }

    // tạo 1 hàm để sinh râ key
    private Key getSignKey() { // đoạn code ma hóa sha key
        byte[] bytes = Decoders.BASE64.decode(secretKey);// dể chuyển đôi từ secretKey string sang 1 đối tượng key // Keys.hmacShaKeyFor(Decoders.BASE64.decode("X0UR5jbk9kS8d2Jm0X5HZ3szo0Yr92ZlRT+F3Slu9cQ="));
        return Keys.hmacShaKeyFor(bytes);
    }
    public String extractRole(String token) {
        Claims claims = extracAllClaims(token);
        return claims.get("role", String.class);
    }

    private String genrateSecretKey() {
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[32];
        random.nextBytes(keyBytes);
        String secretKey = Encoders.BASE64.encode(keyBytes);
        return secretKey;
    }

    private Claims extracAllClaims(String token) { // cái claim này chỉi phục vụ riêng cho jwt nên để private
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey()) // ta truyền getSignKey để sinh  ra claims
                .build().parseClaimsJws(token) // ta truyền getSignKey vào bên trong token đungs cái ta truyền getSignKey đã mã hóa đó thì ta lấy đc claim và claim đos nằm trong boddy
                .getBody();
    }

    // extract riêgn cái claim mà ta muốn bằng cách lấy ra tất cả claim r lấy cái t mong muốn
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = this.extracAllClaims(token);// gọi hàm bên trên extracAllClaims để lấy táta cả claim
        return claimsResolver.apply(claims); // ta truyền funtion và nó trả về 1 đối tượng apply . cần thuộc tính gì thì truyển vào  claimsResolver

    }

    // check expiration kiểm tra token hết hạn chưa
    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration); //lưu lại ngày  quá hạn
        return expirationDate.before(new Date());                                      // trả về xem ngày đó có trc ngày quá hạn hay k
    }
public String extracPhoneNumber(String token){  // trog claim ta coi extracPhoneNumber là subject
        return extractClaim(token,Claims::getSubject); // return extreccalim đầu vào token , tham chiếu đến function(tức refernce ) lấy ra các subject cuả đối tượng
}
public boolean validateToken(String token, UserDetails userDetails){ // valisate token
        String phoneNumber = extracPhoneNumber(token);
        return (phoneNumber.equals(userDetails.getUsername())) // kiểm tra phomenumber này = phone number truyèn vào hay k . nếu ok thì tọken hợp lệ
        && !isTokenExpired(token);   // kieemr tra token conf han k

}
}
