package com.javaweb.api.web;

import com.javaweb.entity.UserEntity;
import com.javaweb.model.dto.UserDTO;
import com.javaweb.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthAPI {

    @Autowired
    private IUserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // Find user by username
            UserDTO user = userService.findOneByUserNameAndStatus(username, 1);
            
            if (user == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid username or password");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check password
            if (!userService.checkPassword(password, user.getPassword())) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid username or password");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Create a simple token (in production you would use JWT or similar)
            Map<String, Object> response = new HashMap<>();
            response.put("token", "user-auth-token-" + System.currentTimeMillis());
            response.put("username", user.getUserName());
            response.put("fullName", user.getFullName());
            response.put("roles", user.getRoleCode());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            // Check if username already exists
            UserDTO existingUser = userService.findOneByUserNameAndStatus(userDTO.getUserName(), 1);
            if (existingUser != null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Register new user
            UserDTO savedUser = userService.insert(userDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("username", savedUser.getUserName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 