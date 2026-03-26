package com.UserApplication.user_service.model;

import lombok.Getter;
import lombok.Setter;

public class UserDTO {

    @Getter @Setter
    private String userId;
    @Getter @Setter
    private String username;
    @Getter @Setter
    private String password;
    @Getter @Setter
    private String email;
    @Getter @Setter
    private String role; 
    @Getter @Setter
    private String firstName;
    @Getter @Setter
    private String lastName;
}
