package com.agentplatform.backend.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

public class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private RoleService roleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void ensureRole_returnsExistingRole() {
        Role role = new Role("ADMIN");
        when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(role));
        Role result = roleService.ensureRole("ADMIN");
        assertThat(result).isEqualTo(role);
        verify(roleRepository, never()).save(any());
    }

    @Test
    void ensureRole_createsRoleIfMissing() {
        when(roleRepository.findByName("USER")).thenReturn(Optional.empty());
        Role saved = new Role("USER");
        when(roleRepository.save(any())).thenReturn(saved);
        Role result = roleService.ensureRole("USER");
        assertThat(result.getName()).isEqualTo("USER");
        verify(roleRepository).save(any());
    }

    @Test
    void assignRoleToUser_assignsRole() {
        User user = new User("test@example.com", "pw");
        user.setId(1L);
        Role role = new Role("ADMIN");
        role.setId(2L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(role));
        roleService.assignRoleToUser(1L, "ADMIN");
        verify(userRepository).assignRole(1L, 2L);
    }

    @Test
    void assignRoleToUser_throwsIfUserMissing() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> roleService.assignRoleToUser(99L, "ADMIN"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("User not found");
    }

    @Test
    void removeRoleFromUser_removesIfRoleExists() {
        Role role = new Role("USER");
        role.setId(3L);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
        roleService.removeRoleFromUser(1L, "USER");
        verify(userRepository).removeRole(1L, 3L);
    }

    @Test
    void removeRoleFromUser_noopIfRoleMissing() {
        when(roleRepository.findByName("MISSING")).thenReturn(Optional.empty());
        roleService.removeRoleFromUser(1L, "MISSING");
        verify(userRepository, never()).removeRole(anyLong(), anyLong());
    }
}
