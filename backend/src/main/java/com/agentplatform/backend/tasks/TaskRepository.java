package com.agentplatform.backend.tasks;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByOwnerIdAndArchivedFalse(Long ownerId, Pageable pageable);

    Page<Task> findByOwnerIdAndStatusAndArchivedFalse(Long ownerId, String status, Pageable pageable);

    List<Task> findByOwnerIdAndStatusAndArchivedFalse(Long ownerId, String status);

    Page<Task> findByOwnerIdAndPriorityAndArchivedFalse(Long ownerId, String priority, Pageable pageable);

    Page<Task> findByOwnerIdAndCategoryAndArchivedFalse(Long ownerId, String category, Pageable pageable);

    long countByOwnerIdAndStatusAndArchivedFalse(Long ownerId, String status);

    Optional<Task> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByIdAndOwnerId(Long id, Long ownerId);
}
