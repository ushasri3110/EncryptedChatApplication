package com.chat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long chatId;
    private String chatName;
    private String chatImage;
    private boolean isGroup;
    @ManyToMany
    private Set<User> admins=new HashSet<>();
    @ManyToOne
    private User createdBy;
    @ManyToMany
    private Set<User> users=new HashSet<>();
    @OneToMany
    private List<Message> messages=new ArrayList<>();
}
