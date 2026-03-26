package com.OrderApplication.order_service.service;

import java.util.ArrayList;
import com.OrderApplication.order_service.model.OrderDTO;

public interface OrderService {
    OrderDTO addOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(String orderId);
    ArrayList<OrderDTO> getOrdersByUserId(String userId);
    ArrayList<OrderDTO> getAllOrders();
    OrderDTO updateOrder(OrderDTO orderDTO);
    String deleteOrder(String orderId);
}
