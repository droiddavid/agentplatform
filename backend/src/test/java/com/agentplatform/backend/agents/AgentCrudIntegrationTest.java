package com.agentplatform.backend.agents;

import com.agentplatform.backend.agents.dto.AgentCreateRequest;
import com.agentplatform.backend.agents.dto.AgentResponse;
import com.agentplatform.backend.auth.User;
import com.agentplatform.backend.auth.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class AgentCrudIntegrationTest {

    @Autowired
    AgentService agentService;

    @Autowired
    AgentRepository agentRepository;

    @Autowired
    UserRepository userRepository;

    @Test
    public void createListUpdateDelete_withOwnershipChecks() {
        // create two users
        User u1 = userRepository.save(new User("owner1@example.com", "x"));
        User u2 = userRepository.save(new User("owner2@example.com", "x"));

        // create agent for user1
        AgentCreateRequest req = new AgentCreateRequest("MyAgent","desc");
        AgentResponse created = agentService.createAgent(u1.getId(), req);
        assertThat(created).isNotNull();

        // list by owner
        List<AgentResponse> list1 = agentService.listByOwner(u1.getId());
        assertThat(list1).extracting(AgentResponse::getId).contains(created.getId());

        // other owner should not see it
        List<AgentResponse> list2 = agentService.listByOwner(u2.getId());
        assertThat(list2).doesNotContain(created);

        // get by id for owner returns
        AgentResponse got = agentService.getByIdForOwner(u1.getId(), created.getId());
        assertThat(got).isNotNull();

        // update by wrong owner should return null
        AgentResponse badUpdate = agentService.updateAgent(u2.getId(), created.getId(), new AgentCreateRequest("Hacked","x"));
        assertThat(badUpdate).isNull();

        // update by correct owner
        AgentResponse updated = agentService.updateAgent(u1.getId(), created.getId(), new AgentCreateRequest("Renamed","updated desc"));
        assertThat(updated).isNotNull();
        assertThat(updated.getName()).isEqualTo("Renamed");

        // delete by wrong owner does nothing
        agentService.deleteByIdForOwner(u2.getId(), created.getId());
        assertThat(agentRepository.findById(created.getId())).isPresent();

        // delete by owner removes
        agentService.deleteByIdForOwner(u1.getId(), created.getId());
        assertThat(agentRepository.findById(created.getId())).isEmpty();
    }
}
