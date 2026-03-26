package com.OrderApplication.order_service.controller;

import com.OrderApplication.order_service.model.OrderDTO;
import com.OrderApplication.order_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping(value = "/api/addorder")
    public OrderDTO addOrder(@RequestBody OrderDTO orderDTO) {
        return orderService.addOrder(orderDTO);
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
    public ArrayList<OrderDTO> getOrderList() {
        return orderService.getAllOrders();
    }

    @PutMapping(value = "/api/updateorder")
    public OrderDTO updateOrder(@RequestBody OrderDTO orderDTO) {
        return orderService.updateOrder(orderDTO);
    }

    @DeleteMapping(value = "/api/deleteorder/{orderId}")
    public String deleteOrder(@PathVariable String orderId) {
        return orderService.deleteOrder(orderId);
    }
}
