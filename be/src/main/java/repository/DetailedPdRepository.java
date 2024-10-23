package repository;

import entity.DetailedPd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailedPdRepository extends JpaRepository<DetailedPd, Integer> {
}
