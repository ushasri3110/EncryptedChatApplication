package com.chat.service;

import com.chat.config.JwtProvider;
import com.chat.exception.UserException;
import com.chat.model.User;
import com.chat.repository.UserRepository;
import com.chat.request.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findUserById(Long id) throws UserException{
        Optional<User> opt=userRepository.findById(id);
        if (opt.isPresent()){
            return opt.get();
        }
        throw new UserException("User not found");
    }

    public User findUserProfile(String jwt){
        String email=JwtProvider.getEmailFromJwt(jwt);
        return userRepository.findByEmail(email);
    }

    public User updateUser(Long userId, UpdateUserRequest req){
        User user=findUserById(userId);
        System.out.println(user);
        if (req.getFullName()!=null){
            user.setFullName(req.getFullName());
        }
        if (req.getProfilePic()!=null){
            user.setProfilePic(req.getProfilePic());
        }
        System.out.println(user);
        return userRepository.save(user);
    }

    public List<User> findUsers(String query){
        return userRepository.searchUsers(query);
    }
}
