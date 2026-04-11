package com.UserApplication.user_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="users") 
public class User {

    @Id
    @Column(name="user_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;
    
    @Column(name="username", unique=true)
    private String username;

    @JsonIgnore
    @Column(name="password")
    private String password;
    
    @Column(name="email", unique=true)
    private String email;
    
    @Column(name="role")
    private String role;
    
    @Column(name="first_name")
    private String firstName;
    
    @Column(name="last_name")
    private String lastName;
}
