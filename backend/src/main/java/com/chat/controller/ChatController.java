package com.chat.controller;

import com.chat.model.Chat;
import com.chat.model.User;
import com.chat.request.GroupChatRequest;
import com.chat.service.ChatService;
import com.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;
    @Autowired
    private UserService userService;
    @PostMapping("/createSingleChat")
    public ResponseEntity<Chat> createChatHandler(@RequestBody Long userId, @RequestHeader("Authorization") String jwt){
        User reqUser=userService.findUserProfile(jwt);
        Chat chat=chatService.createChat(reqUser,userId);
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

    @PostMapping("/createGroupChat")
    public ResponseEntity<Chat> createGroupChatHandler(@RequestBody GroupChatRequest req, @RequestHeader("Authorization") String jwt){
        User reqUser=userService.findUserProfile(jwt);
        Chat chat=chatService.createGroup(req,reqUser);
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

    @GetMapping("/findChatById/{chatId}")
    public ResponseEntity<Chat> findChatById(@PathVariable Long chatId){
        Chat chat=chatService.findChatById(chatId);
        return new ResponseEntity<>(chat,HttpStatus.OK);
    }

    @GetMapping("/findAllChats")
    public ResponseEntity<List<Chat>> findAllChatsByUserId(@RequestHeader("Authorization") String jwt){
        User reqUser=userService.findUserProfile(jwt);
        List<Chat> chats=chatService.findAllChatsByUserId(reqUser.getUserId());
        return new ResponseEntity<>(chats,HttpStatus.OK);
    }

    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroup(@RequestHeader("Authorization") String jwt,@PathVariable long chatId,
                                               @PathVariable Long userId){
        User reqUser=userService.findUserProfile(jwt);
        Chat chat=chatService.addUserToGroup(userId,chatId,reqUser);
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserFromGroup(@RequestHeader("Authorization") String jwt,@PathVariable long chatId,
                                               @PathVariable Long userId){
        User reqUser=userService.findUserProfile(jwt);
        Chat chat=chatService.removeFromGroup(userId,chatId,reqUser);
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<String> deleteChat(@RequestHeader("Authorization") String jwt,@PathVariable Long chatId){
        User reqUser=userService.findUserProfile(jwt);
        String res= chatService.deleteChat(chatId,reqUser);
        return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
    }

}