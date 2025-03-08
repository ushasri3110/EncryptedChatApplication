package com.chat.controller;

import com.chat.model.Message;
import com.chat.model.User;
import com.chat.request.SendMessageRequest;
import com.chat.service.ChatService;
import com.chat.service.MessageService;
import com.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;

    @PostMapping("/sendMessage")
    public ResponseEntity<Message> sendMessageHandler(@RequestBody SendMessageRequest req,
                                                      @RequestHeader("Authorization") String jwt){
        User user=userService.findUserProfile(jwt);
        req.setUserId(user.getUserId());
        return new ResponseEntity<>(messageService.sendMessage(req), HttpStatus.CREATED);
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getAllMessagesByChatId(@PathVariable Long chatId,@RequestHeader("Authorization") String jwt){
        User user=userService.findUserProfile(jwt);
        return new ResponseEntity<>(messageService.getChatMessage(chatId,user),HttpStatus.OK);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long messageId,@RequestHeader("Authorization") String jwt){
        User user=userService.findUserProfile(jwt);
        return new ResponseEntity<>(messageService.deleteMessage(messageId,user),HttpStatus.OK);
    }
}
