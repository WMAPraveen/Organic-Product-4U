package com.UserApplication.user_service.controller;

import com.UserApplication.user_service.model.UserDTO;
import com.UserApplication.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.UserApplication.user_service.util.JwtUtil;


@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    //  anyone can register (no token needed)
    @PostMapping(value = "/api/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            UserDTO registered = userService.register(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(registered);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //  ADMIN or self — get user by id
    @GetMapping(value = "/api/user/{userId}")
    public ResponseEntity<?> getUserById(
            @PathVariable String userId,
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        boolean isAuthorized = "ADMIN".equals(role);

        if (!isAuthorized && authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                String tokenUserId = jwtUtil.extractUserId(token);
                if (userId.equals(tokenUserId)) {
                    isAuthorized = true;
                }
            }
        }

        if (!isAuthorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only or unauthorized");
        }
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    //  ADMIN only — get user by username
    @GetMapping(value = "/api/user/username/{username}")
    public ResponseEntity<?> getUserByUsername(
            @PathVariable String username,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    //  ADMIN only — get all users
    @GetMapping(value = "/api/userlist")
    public ResponseEntity<?> getUserList(
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    //  USER — update own profile
    @PutMapping(value = "/api/updateuser")
    public ResponseEntity<?> updateUser(
            @RequestHeader(value = "Authorization", required = false) String tokenHeader,
            @RequestBody UserDTO userDTO) {
        try {
            return ResponseEntity.ok(userService.updateUser(tokenHeader, userDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //  ADMIN only — delete user
    @DeleteMapping(value = "/api/deleteuser/{userId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String userId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(userService.deleteUser(userId));
    }
}