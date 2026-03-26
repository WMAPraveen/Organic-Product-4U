package com.OrderApplication.order_service.model;

import lombok.Getter;
import lombok.Setter;

public class UserDTO {

    @Getter @Setter
    private String userId;
    @Getter @Setter
    private String username;
    @Getter @Setter
    private String email;
}
