package com.UserApplication.user_service.model;

import lombok.Getter;
import lombok.Setter;

public class LoginDTO {
    @Getter @Setter
    private String username;
    @Getter @Setter
    private String password;
    @Getter @Setter
    private String role;
    @Getter @Setter
    private String token;

}
