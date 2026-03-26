package com.UserApplication.user_service.service;

import com.UserApplication.user_service.entity.User;
import com.UserApplication.user_service.model.UserDTO;
import com.UserApplication.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDTO addUser(UserDTO userDTO) {
        System.out.println("Received request to add user: " + userDTO.getUsername());
        User user = convertUserDTOtoUser(userDTO);
        User savedUser = userRepository.save(user);
        return convertUsertoUserDTO(savedUser);
    }

    @Override
    public UserDTO getUserById(String userId) {
        return userRepository.findById(userId)
                .map(this::convertUsertoUserDTO)
                .orElse(null);
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertUsertoUserDTO)
                .orElse(null);
    }

    @Override
    public ArrayList<UserDTO> getAllUsers() {
        List<User> userList = userRepository.findAll();
        ArrayList<UserDTO> userDTOList = new ArrayList<>();

        for (User user : userList) {
            userDTOList.add(convertUsertoUserDTO(user));
        }
        return userDTOList;
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        if (userDTO.getUserId() == null) {
            throw new RuntimeException("User ID is required for update.");
        }

        Optional<User> userOptional = userRepository.findById(userDTO.getUserId());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUsername(userDTO.getUsername());
            user.setPassword(userDTO.getPassword());
            user.setEmail(userDTO.getEmail());
            user.setRole(userDTO.getRole());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());

            userRepository.save(user);
            return convertUsertoUserDTO(user);
        } else {
            throw new RuntimeException("User not found with ID: " + userDTO.getUserId());
        }
    }

    @Override
    public String deleteUser(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String username = user.getUsername();
            userRepository.deleteById(userId);
            return "User " + username + " Deleted Successfully";
        }
        return "User Not Found";
    }

    public UserDTO convertUsertoUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        return userDTO;
    }

    public User convertUserDTOtoUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        // Set a default role if not provided
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        return user;
    }
}
