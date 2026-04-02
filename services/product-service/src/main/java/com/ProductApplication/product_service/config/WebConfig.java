package com.ProductApplication.product_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Find the absolute path to the product-images folder
        Path uploadDir = Paths.get("product-images");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/product-images/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
