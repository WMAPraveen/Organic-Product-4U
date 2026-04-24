package com.OrderApplication.order_service.service;

import com.OrderApplication.order_service.entity.Order;
import com.OrderApplication.order_service.model.InventoryDTO;
import com.OrderApplication.order_service.model.OrderDTO;
import com.OrderApplication.order_service.model.ProductDTO;
import com.OrderApplication.order_service.model.UserDTO;
import com.OrderApplication.order_service.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    // utgoing call ---

    private UserDTO fetchUser(String userId) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri("http://user-service/api/user/" + userId)
                    .header("X-User-Role", "ADMIN")
                    .retrieve()
                    .bodyToMono(UserDTO.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }

    private ProductDTO fetchProduct(String productId) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri("http://product-service/api/product/" + productId)
                    .header("X-User-Role", "ADMIN")
                    .retrieve()
                    .bodyToMono(ProductDTO.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }

    private InventoryDTO fetchInventory(String productId) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri("http://inventory-service/api/inventory/product/" + productId)
                    .retrieve()
                    .bodyToMono(InventoryDTO.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    @Transactional
    public OrderDTO addOrder(OrderDTO orderDTO) {
        System.out.println("Received request to add order for user: " + orderDTO.getUserId());

        // 1. Verify user exists
        UserDTO user = fetchUser(orderDTO.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found: " + orderDTO.getUserId());
        }

        // 2. Verify product exists
        ProductDTO product = fetchProduct(orderDTO.getProductId());
        if (product == null) {
            throw new RuntimeException("Product not found: " + orderDTO.getProductId());
        }

        // 3. Check inventory has enough stock
        InventoryDTO inventory = fetchInventory(orderDTO.getProductId());
        if (inventory == null || inventory.getQuantity() < orderDTO.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product: " + orderDTO.getProductId());
        }
        Order order = convertOrderDTOtoOrder(orderDTO);
        // 4. Save the order
        Order savedOrder = orderRepository.save(order);

        // 5. Deduct inventory
        boolean deducted = deductInventory(orderDTO.getProductId(), orderDTO.getQuantity());
        if (!deducted) {
            // order saved but inventory failed
            throw new RuntimeException("Failed to deduct inventory");
        }

        return convertOrdertoOrderDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .map(this::convertOrdertoOrderDTO)
                .orElse(null);
    }

    @Override
    public ArrayList<OrderDTO> getOrdersByUserId(String userId) {
        List<Order> orderList = orderRepository.findByUserId(userId);
        ArrayList<OrderDTO> orderDTOList = new ArrayList<>();

        for (Order order : orderList) {
            orderDTOList.add(convertOrdertoOrderDTO(order));
        }
        return orderDTOList;
    }

    @Override
    public ArrayList<OrderDTO> getAllOrders() {
        List<Order> orderList = orderRepository.findAll();
        ArrayList<OrderDTO> orderDTOList = new ArrayList<>();

        for (Order order : orderList) {
            orderDTOList.add(convertOrdertoOrderDTO(order));
        }
        return orderDTOList;
    }

    @Override
    public OrderDTO updateOrder(OrderDTO orderDTO) {
        if (orderDTO.getOrderId() == null) {
            throw new RuntimeException("Order ID is required for update.");
        }

        Optional<Order> orderOptional = orderRepository.findById(orderDTO.getOrderId());

        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setUserId(orderDTO.getUserId());
            order.setProductId(orderDTO.getProductId());
            order.setQuantity(orderDTO.getQuantity());
            order.setOrderTotal(orderDTO.getOrderTotal());
            order.setStatus(orderDTO.getStatus());

            orderRepository.save(order);
            return convertOrdertoOrderDTO(order);
        } else {
            throw new RuntimeException("Order not found with ID: " + orderDTO.getOrderId());
        }
    }

    @Override
    public String deleteOrder(String orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        if (orderOptional.isPresent()) {
            orderRepository.deleteById(orderId);
            return "Order " + orderId + " Deleted Successfully";
        }
        return "Order Not Found";
    }

    public OrderDTO convertOrdertoOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setUserId(order.getUserId());
        orderDTO.setProductId(order.getProductId());
        orderDTO.setQuantity(order.getQuantity());
        orderDTO.setOrderTotal(order.getOrderTotal());
        orderDTO.setStatus(order.getStatus());
        return orderDTO;
    }

    public Order convertOrderDTOtoOrder(OrderDTO orderDTO) {
        Order order = new Order();
        // ID is auto-generated
        order.setUserId(orderDTO.getUserId());
        order.setProductId(orderDTO.getProductId());
        order.setQuantity(orderDTO.getQuantity());
        order.setOrderTotal(orderDTO.getOrderTotal());
        order.setStatus(orderDTO.getStatus() != null ? orderDTO.getStatus() : "PENDING");
        return order;
    }

    private boolean deductInventory(String productId, int quantity) {
        try {
            return Boolean.TRUE.equals(
                    webClientBuilder.build()
                            .put()
                            .uri("http://inventory-service/api/inventory/deduct/" + productId
                                    + "?quantity=" + quantity)
                            .retrieve()
                            .bodyToMono(Boolean.class)
                            .block()
            );
        } catch (Exception e) {
            return false;
        }
    }
}
