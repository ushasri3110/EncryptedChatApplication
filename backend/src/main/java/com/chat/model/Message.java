package com.chat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String senderEncryptedContent;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String recipientEncryptedContent;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "chat_id", referencedColumnName = "chatId")
    private Chat chat;

    @Transient
    private String content;
}
