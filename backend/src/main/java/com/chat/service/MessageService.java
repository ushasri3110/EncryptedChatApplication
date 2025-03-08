package com.chat.service;

import com.chat.exception.MessageException;
import com.chat.model.Chat;
import com.chat.model.Message;
import com.chat.model.User;
import com.chat.repository.MessageRepository;
import com.chat.request.SendMessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;
    public Message sendMessage(SendMessageRequest req){
        User user =userService.findUserById(req.getUserId());
        Chat chat=chatService.findChatById(req.getChatId());
        Message newMessage=new Message();
        newMessage.setChat(chat);
        newMessage.setUser(user);
        newMessage.setContent(req.getContent());
        newMessage.setTimestamp(LocalDateTime.now());
        return messageRepository.save(newMessage);
    }

    public List<Message> getChatMessage(Long chatId,User reqUser){
        Chat chat=chatService.findChatById(chatId);
        if (chat.getUsers().contains(reqUser)){
            return messageRepository.findByChatId(chatId);
        }
        throw new MessageException("You are Not allowed to view messages");
    }

    public Message findMessageById(Long messageId) throws MessageException{
        Optional<Message> opt=messageRepository.findById(messageId);
        if (opt.isPresent())
        {
            return opt.get();
        }
        throw new MessageException("Message Not Found");
    }

    public String deleteMessage(Long messageId,User reqUser){
        Message message=findMessageById(messageId);
        if (message.getUser().getUserId().equals(reqUser.getUserId())){
            messageRepository.delete(message);
            return "Message Deleted Successfully";
        }
        throw new MessageException("You are not allowed to delete the message");
    }
}
