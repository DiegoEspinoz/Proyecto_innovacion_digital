package com.ecoliving.dto;

import com.ecoliving.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private User.Role role;
    private LocalDateTime createdAt;

    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}

