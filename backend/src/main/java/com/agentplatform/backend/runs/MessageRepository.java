package com.agentplatform.backend.runs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Find all messages for a run, ordered by creation time
     */
    List<Message> findByRunIdOrderByCreatedAtAsc(Long runId);

    /**
     * Find all messages for a run with pagination
     */
    Page<Message> findByRunId(Long runId, Pageable pageable);

    /**
     * Find messages sent by a specific agent
     */
    List<Message> findBySenderAgentIdAndRunId(Long senderAgentId, Long runId);

    /**
     * Find messages received by a specific agent
     */
    List<Message> findByRecipientAgentIdAndRunId(Long recipientAgentId, Long runId);

    /**
     * Find messages of a specific type in a run
     */
    List<Message> findByRunIdAndMessageType(Long runId, String messageType);

    /**
     * Find unread messages for a recipient in a run
     */
    @Query("SELECT m FROM Message m WHERE m.runId = :runId AND m.recipientAgentId = :agentId AND m.status = 'sent'")
    List<Message> findUnreadMessagesForAgent(@Param("runId") Long runId, @Param("agentId") Long agentId);

    /**
     * Count messages in a run
     */
    long countByRunId(Long runId);

    /**
     * Count unread messages for a recipient in a run
     */
    long countByRunIdAndRecipientAgentIdAndStatus(Long runId, Long recipientAgentId, String status);
}
