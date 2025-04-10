package com.chat.repository;

import com.chat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {

    @Query("select m from Message m join m.chat c where c.id = :chatId")
    public List<Message> findByChatId(@Param("chatId") Long chatId);
}
