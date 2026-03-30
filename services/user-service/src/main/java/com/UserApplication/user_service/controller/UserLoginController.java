package com.UserApplication.user_service.controller;

import com.UserApplication.user_service.model.LoginDTO;
import com.UserApplication.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserLoginController {

    @Autowired
    UserService userService;

    @PostMapping("/api/login")
    public ResponseEntity<LoginDTO> login(@RequestBody LoginDTO loginDTO) {
        LoginDTO response = userService.login(loginDTO);
        if (response == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(response);
    }

}
