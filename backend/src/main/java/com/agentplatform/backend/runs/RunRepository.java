package com.agentplatform.backend.runs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RunRepository extends JpaRepository<Run, Long> {
    Page<Run> findByOwnerId(Long ownerId, Pageable pageable);

    Page<Run> findByOwnerIdAndStatus(Long ownerId, String status, Pageable pageable);

    Page<Run> findByOwnerIdAndTaskId(Long ownerId, Long taskId, Pageable pageable);

    Page<Run> findByOwnerIdAndAgentId(Long ownerId, Long agentId, Pageable pageable);

    List<Run> findByTaskIdAndOwnerId(Long taskId, Long ownerId);

    List<Run> findByAgentIdAndOwnerId(Long agentId, Long ownerId);

    Optional<Run> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByIdAndOwnerId(Long id, Long ownerId);

    long countByOwnerIdAndStatus(Long ownerId, String status);

    List<Run> findByOwnerIdAndStatusOrderByCreatedAtDesc(Long ownerId, String status);
}
