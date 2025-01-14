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

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tokens")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "token", length = 255)
    private String token; // là 1 sâu ký tự dài

    @Column(name = "token_type", length = 50)
    private String tokenType;

    @Column(name = "expiration_date")//thời gian ngày giờ token đó hết hạn (tính theo ngày giờ phút giây)
    private LocalDateTime expirationDate;

    private boolean revoked;// đã bị hủy chưa
    private boolean expired;// đã hêt hạn chưa

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
