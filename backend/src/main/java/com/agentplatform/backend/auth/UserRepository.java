package com.agentplatform.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // assign/remove role via native queries against user_roles join table
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (:userId, :roleId)", nativeQuery = true)
    void assignRole(@org.springframework.data.repository.query.Param("userId") Long userId, @org.springframework.data.repository.query.Param("roleId") Long roleId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM user_roles WHERE user_id = :userId AND role_id = :roleId", nativeQuery = true)
    void removeRole(@org.springframework.data.repository.query.Param("userId") Long userId, @org.springframework.data.repository.query.Param("roleId") Long roleId);
}
