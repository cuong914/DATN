package com.example.shopapp.repositorys;

import com.example.shopapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
//kiem tra user co phone number co ton tai hay k
    boolean existsByPhoneNumber(String phoneNumber);

    // kiem tra xem ket qua
    Optional<User> findByPhoneNumber(String phoneNumber);
}
