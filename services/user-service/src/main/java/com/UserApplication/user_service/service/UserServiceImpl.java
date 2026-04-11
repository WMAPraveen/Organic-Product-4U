package com.UserApplication.user_service.service;

import com.UserApplication.user_service.entity.User;
import com.UserApplication.user_service.model.LoginDTO;
import com.UserApplication.user_service.model.UserDTO;
import com.UserApplication.user_service.repository.UserRepository;
import com.UserApplication.user_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDTO register(UserDTO userDTO) {
        System.out.println("Received request to register user: " + userDTO.getUsername());

        // check email not already taken
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + userDTO.getEmail());
        }

        User user = convertUserDTOtoUser(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole("USER");
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
    public UserDTO updateUser(String tokenHeader, UserDTO userDTO) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            String token = tokenHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                String userId = jwtUtil.extractUserId(token);
                String username = jwtUtil.extractUsername(token);
                
                if (userId != null) {
                    userDTO.setUserId(userId);
                    if (userDTO.getUsername() == null || userDTO.getUsername().isBlank()) {
                        userDTO.setUsername(username);
                    }
                } else if (username != null) {
                    Optional<User> existingUser = userRepository.findByUsername(username);
                    if (existingUser.isPresent()) {
                        userDTO.setUserId(existingUser.get().getUserId());
                        if (userDTO.getUsername() == null || userDTO.getUsername().isBlank()) {
                            userDTO.setUsername(existingUser.get().getUsername());
                        }
                    }
                }
            }
        }

        if (userDTO.getUserId() == null) {
            throw new RuntimeException("User ID is required for update.");
        }

        Optional<User> userOptional = userRepository.findById(userDTO.getUserId());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUsername(userDTO.getUsername());

            if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }

            user.setEmail(userDTO.getEmail());
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

    public LoginDTO login(LoginDTO loginDTO) {

        Optional<User> userOptional = userRepository.findByUsername(loginDTO.getUsername());

        if (userOptional.isEmpty())
            return null;

        User user = userOptional.get();

        // simple password check — in production use BCrypt
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword()))
            return null;

        // generate token with username, role and userId
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getUserId());

        LoginDTO response = new LoginDTO();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        response.setToken(token);
        return response;
    }

    public UserDTO convertUsertoUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(null);
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
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        return user;
    }
}
