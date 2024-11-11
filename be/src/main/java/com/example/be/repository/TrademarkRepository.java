package com.example.be.repository;

import com.example.be.entity.Trademark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrademarkRepository extends JpaRepository<Trademark, Integer> {
}
