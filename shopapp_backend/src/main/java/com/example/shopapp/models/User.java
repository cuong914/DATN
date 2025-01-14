package com.example.shopapp.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fullname", length = 10, nullable = false)
    private String fullName;

    @Column(name = "phone_number", length = 10, nullable = false)
    private String phoneNumber;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "password", length = 200)
    private String password;

    @Column(name = "is_active")
    private boolean active;

    @Column(name = "facebook_account_id")
    private int facebookAccountId;

    @Column(name = "google_account_id")
    private int googleAccountId;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { // lấy ra các quyền
        List<SimpleGrantedAuthority> authoritiList = new ArrayList<>();
      authoritiList.add(new SimpleGrantedAuthority("ROLE_" + getRole().getName().toUpperCase())); // toUpperCase tức là chuyển đổi toàn bộ thành chữ hoa

       // authoritiList.add(new SimpleGrantedAuthority("ROLE_ADMIN")); // fake
// lấy để xem  mình có quyền j
        return authoritiList;
    }

    @Override
    public String getUsername() {//cái đối tượng usrdetaili cua java swing
        // hiểu cái trường là username là cái trường duy nhất để sd đăng nhập
        return phoneNumber;
    }

    @Override
    public boolean isAccountNonExpired() { // account này có thơif lượng vô thười hạn
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {// k thế khóa đc
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
