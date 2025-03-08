package com.chat.controller;

import com.chat.model.User;
import com.chat.request.UpdateUserRequest;
import com.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getUserProfile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String jwt){
        User user=userService.findUserProfile(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/findUsers/{query}")
    public ResponseEntity<List<User>> searchUserHandler(@PathVariable("query") String query){
        List<User> users=userService.findUsers(query);
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUserHandler(@RequestHeader("Authorization") String jwt,@RequestBody UpdateUserRequest req){
        User user=userService.findUserProfile(jwt);
        User updatedUser=userService.updateUser(user.getUserId(),req);
        return new ResponseEntity<>(updatedUser,HttpStatus.ACCEPTED);
    }

}
