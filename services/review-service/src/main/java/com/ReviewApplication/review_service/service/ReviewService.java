package com.ReviewApplication.review_service.service;

import com.ReviewApplication.review_service.model.ReviewDTO;

import java.util.List;

public interface ReviewService {
    ReviewDTO addReview(ReviewDTO reviewDTO);
    ReviewDTO getReviewById(String reviewId);
    List<ReviewDTO> getReviewsByProductId(String productId);
    List<ReviewDTO> getReviewsByUserId(String userId);
    ReviewDTO updateReview(String reviewId, ReviewDTO reviewDTO);
    void deleteReview(String reviewId);
    List<ReviewDTO> getAllReviews();
}
