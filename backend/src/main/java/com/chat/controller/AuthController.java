package com.chat.controller;

import com.chat.config.JwtProvider;
import com.chat.exception.UserException;
import com.chat.model.User;
import com.chat.repository.UserRepository;
import com.chat.request.LoginRequest;
import com.chat.response.AuthResponse;
import com.chat.service.CustomUserDetailsService;
import com.chat.utils.KeyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.*;
import java.util.Base64;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {
        // Check if user exists
        User isExist = userRepository.findByEmail(user.getEmail());
        if (isExist != null) {
            throw new UserException("User With Email Already Exists");
        }

        // Generate RSA keys
        KeyPair keyPair = KeyUtil.generateRSAKeyPair();
        PublicKey publicKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();

        // Convert keys to strings
        String publicKeyStr = KeyUtil.encodePublicKey(publicKey);
        String encryptedPrivateKeyStr = KeyUtil.encryptPrivateKey(privateKey);

        // Store in DB
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setFullName(user.getFullName());
        newUser.setProfilePic(user.getProfilePic());
        newUser.setPublicKey(publicKeyStr);
        newUser.setEncryptedPrivateKey(encryptedPrivateKeyStr);

        User savedUser = userRepository.save(newUser);
        if (savedUser.getUserId() == null) {
            throw new UserException("Unable To Signup");
        }

        // Authenticate and generate JWT
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = JwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Signup Successful");

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) throws UserException {
        Authentication authentication = authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = JwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successful");

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    // Helper for authentication
    public Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new UserException("User does not exist");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("Password does not match");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
    public static KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048); // Key size
        return generator.generateKeyPair();
    }

}
