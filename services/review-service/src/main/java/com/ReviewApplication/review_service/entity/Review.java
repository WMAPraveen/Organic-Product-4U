package com.ReviewApplication.review_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Review {

    @Id
    @Column(name="review_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String reviewId;

    @Column(name="product_id", nullable = false)
    private String productId;

    @Column(name="user_id", nullable = false)
    private String userId;

    @Column(name="user_name")
    private String userName;

    @Column(name="rating", nullable = false)
    private Integer rating;

    @Column(name="comment", length = 1000)
    private String comment;

    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name="updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void setLastUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
