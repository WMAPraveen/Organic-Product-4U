package com.OrderApplication.order_service.controller;

import com.OrderApplication.order_service.model.OrderDTO;
import com.OrderApplication.order_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping(value = "/api/addorder")
    public ResponseEntity<?> addOrder(@RequestBody OrderDTO orderDTO) {
        try {
            return ResponseEntity.ok(orderService.addOrder(orderDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(value = "/api/order/{orderId}")
    public OrderDTO getOrderById(@PathVariable String orderId) {
        return orderService.getOrderById(orderId);
    }

    @GetMapping(value = "/api/order/user/{userId}")
    public ArrayList<OrderDTO> getOrdersByUserId(@PathVariable String userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping(value = "/api/orderlist")
    public ResponseEntity<?> getOrderList(
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping(value = "/api/updateorder")
    public OrderDTO updateOrder(@RequestBody OrderDTO orderDTO) {
        return orderService.updateOrder(orderDTO);
    }

    @DeleteMapping(value = "/api/deleteorder/{orderId}")
    public ResponseEntity<?> deleteOrder(
            @PathVariable String orderId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(orderService.deleteOrder(orderId));
    }
}
