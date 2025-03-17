package com.chat.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupChatRequest {
    private List<Long> userIds;
    private String chatName;
    private String chatImage;
}
