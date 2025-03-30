package com.chat.service;

import com.chat.exception.MessageException;
import com.chat.model.Chat;
import com.chat.model.Message;
import com.chat.model.User;
import com.chat.repository.MessageRepository;
import com.chat.request.SendMessageRequest;
import com.chat.utils.KeyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;

    public Message sendMessage(SendMessageRequest req) {
        User sender = userService.findUserById(req.getUserId());
        Chat chat = chatService.findChatById(req.getChatId());

        // Find recipient
        User recipient = chat.getUsers().stream()
                .filter(user -> !user.getUserId().equals(sender.getUserId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        try {
            // Decode sender public key
            PublicKey senderPublicKey = KeyFactory.getInstance("RSA")
                    .generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(sender.getPublicKey())));

            // Decode recipient public key
            PublicKey recipientPublicKey = KeyFactory.getInstance("RSA")
                    .generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(recipient.getPublicKey())));

            // Encrypt message content for both sender and recipient
            String encryptedForSender = KeyUtil.encryptMessage(req.getContent(), senderPublicKey);
            String encryptedForRecipient = KeyUtil.encryptMessage(req.getContent(), recipientPublicKey);
            System.out.println("Encrypted Message:"+encryptedForRecipient);
            // Store both encrypted versions
            Message newMessage = new Message();
            newMessage.setChat(chat);
            newMessage.setUser(sender);
            newMessage.setSenderEncryptedContent(encryptedForSender);
            newMessage.setRecipientEncryptedContent(encryptedForRecipient);
            newMessage.setTimestamp(LocalDateTime.now());

            return messageRepository.save(newMessage);

        } catch (Exception e) {
            throw new RuntimeException("Error during message encryption: " + e.getMessage());
        }
    }

    public List<Message> getChatMessage(Long chatId, User reqUser) {
        Chat chat = chatService.findChatById(chatId);

        if (!chat.getUsers().contains(reqUser)) {
            throw new MessageException("You are not allowed to view messages");
        }

        List<Message> messages = messageRepository.findByChatId(chatId);

        try {
            PrivateKey userPrivateKey = KeyUtil.decryptPrivateKey(reqUser.getEncryptedPrivateKey());

            for (Message msg : messages) {
                try {
                    String encryptedContent;
                    if (msg.getUser().getUserId().equals(reqUser.getUserId())) {
                        encryptedContent = msg.getSenderEncryptedContent();
                    } else {
                        encryptedContent = msg.getRecipientEncryptedContent();
                    }

                    String decryptedContent = KeyUtil.decryptMessage(encryptedContent, userPrivateKey);
                    System.out.println("decrypted message:"+decryptedContent);
                    msg.setContent(decryptedContent);  // Set the decrypted content

                } catch (Exception e) {
                    throw new RuntimeException("Error decrypting message: " + e.getMessage());
                }
            }

            return messages;

        } catch (Exception e) {
            throw new RuntimeException("Invalid private key: " + e.getMessage());
        }
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
