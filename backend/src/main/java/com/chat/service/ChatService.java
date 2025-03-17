package com.chat.service;

import com.chat.exception.ChatException;
import com.chat.model.Chat;
import com.chat.model.User;
import com.chat.repository.ChatRepository;
import com.chat.request.GroupChatRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private UserService userService;

    public Chat createChat(User reqUser,Long userId2){
        User user=userService.findUserById(userId2);
        Chat isExist=chatRepository.findSingleChatByUserIds(user,reqUser);
        if (isExist!=null){
            return isExist;
        }
        Chat newChat=new Chat();
        newChat.setCreatedBy(reqUser);
        newChat.getUsers().add(reqUser);
        newChat.getUsers().add(user);
        newChat.setGroup(false);
        return chatRepository.save(newChat);
    }

    public Chat findChatById(Long chatId) throws ChatException{
        Optional<Chat> opt=chatRepository.findById(chatId);
        if (opt.isPresent()){
            return opt.get();
        }
        throw new ChatException("Chat Not Found");
    }

    public List<Chat> findAllChatsByUserId(Long userId){
        User user=userService.findUserById(userId);
        return chatRepository.findChatsByUserId(user.getUserId());
    }

    public Chat createGroup(GroupChatRequest req,User reqUser) throws ChatException{
        Chat group=new Chat();
        group.getUsers().add(reqUser);
        group.setGroup(true);
        group.setCreatedBy(reqUser);
        group.setChatImage(req.getChatImage());
        group.setChatName(req.getChatName());
        group.getAdmins().add(reqUser);
        for (Long userId:req.getUserIds()){
            User user=userService.findUserById(userId);
            group.getUsers().add(user);
        }
        System.out.println(group);
        return chatRepository.save(group);
    }

    public Chat addUserToGroup(Long userId,Long chatId,User reqUser){
        Chat chat=findChatById(chatId);
        User user=userService.findUserById(userId);
        if (chat!=null){
            if (chat.getAdmins().contains(reqUser)){
                chat.getUsers().add(user);
                return chatRepository.save(chat);
            }
            throw new ChatException("Only Admins Can Add");
        }
        throw new ChatException("Chat Not Found");
    }

    public Chat renameGroup(Long chatId,String groupName,User reqUser){
        Chat chat=findChatById(chatId);
        if (chat!=null){
            if (chat.getUsers().contains(reqUser)){
                chat.setChatName(groupName);
                return chatRepository.save(chat);
            }
            throw new ChatException("You are not a member of this group");
        }
        throw new ChatException("Chat Not Found");
    }

    public Chat removeFromGroup(Long userId,Long chatId,User reqUser){
        Chat chat=findChatById(chatId);
        User user=userService.findUserById(userId);
        if (chat!=null){
            if (chat.getAdmins().contains(reqUser)){
                chat.getUsers().remove(user);
                return chatRepository.save(chat);
            }
            else if (chat.getUsers().contains(reqUser)){
                if (reqUser.getUserId().equals(userId)){
                    chat.getUsers().remove(reqUser);
                    return chatRepository.save(chat);
                }
            }
            throw new ChatException("Only Admins Can Remove");
        }
        throw new ChatException("Chat Not Found");
    }

    public String deleteChat(Long chatId,User reqUser){
        Chat chat=findChatById(chatId);
        if (chat.getAdmins().contains(reqUser)){
            chatRepository.delete(chat);
            return "Chat Deleted Successfully";
        }
        throw new ChatException("Only Admins Can Delete The Group");
    }
}
