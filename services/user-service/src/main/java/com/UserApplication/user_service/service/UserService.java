package com.UserApplication.user_service.service;

import java.util.ArrayList;

import com.UserApplication.user_service.model.LoginDTO;
import com.UserApplication.user_service.model.UserDTO;

public interface UserService {
    UserDTO register(UserDTO userDTO);
    UserDTO getUserById(String userId);
    UserDTO getUserByUsername(String username);
    ArrayList<UserDTO> getAllUsers();
    UserDTO updateUser(UserDTO userDTO);
    String deleteUser(String userId);
    LoginDTO login(LoginDTO loginDTO);
}
