package com.ProductApplication.product_service.service;

import com.ProductApplication.product_service.entity.Product;
import com.ProductApplication.product_service.model.ProductDTO;
import com.ProductApplication.product_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductRepository productRepository;

    @Value("${app.image.base-url}")
    private String imageBaseUrl;

    // Define image stored file path....

    private final String IMAGE_UPLOAD_DIRECTORY = "product-images/";

    // Create a product...............

    public ProductDTO addProduct(ProductDTO productDTO) {

        try {
            System.out.println("Received request to add product: " + productDTO.getProductName());

            Product product = convertProductDTOtoProduct(productDTO);
            System.out.println("Converted to Entity. Ready to save.");

            Product savedProduct = productRepository.save(product);
            System.out.println("Product saved to DB. ID: " + savedProduct.getProductId());

            return convertProducttoProductDTO(savedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to Add Product: " + e.getMessage());
        }

    }

    // Find product by specific Id...............

    public ProductDTO getProductById(String productId) {
        return productRepository.findById(productId)
                .map(this::convertProducttoProductDTO)
                .orElse(null);
    }

    // Find all products...............

    public ArrayList<ProductDTO> getAllProducts() {
        List<Product> ProductList = productRepository.findAll();
        ArrayList<ProductDTO> ProductDTOList = new ArrayList<>();

        for (Product product : ProductList) {

            ProductDTO productDTO = convertProducttoProductDTO(product);
            ProductDTOList.add(productDTO);

        }
        return ProductDTOList;
    }

    // Find all products by category id...............

    public ArrayList<ProductDTO> getAllProductsByCategoryId(Integer categoryId) {
        List<Product> productList = productRepository.findByCategoryId(categoryId);
        ArrayList<ProductDTO> productDTOList = new ArrayList<>();

        for (Product product : productList) {
            ProductDTO productDTO = convertProducttoProductDTO(product);
            productDTOList.add(productDTO);
        }
        return productDTOList;
    }

    // Search products by keyword...............

    public ArrayList<ProductDTO> searchProducts(String keyword) {
        List<Product> productList = productRepository.findByProductNameContainingIgnoreCase(keyword);
        ArrayList<ProductDTO> productDTOList = new ArrayList<>();

        for (Product product : productList) {
            ProductDTO productDTO = convertProducttoProductDTO(product);
            productDTOList.add(productDTO);
        }
        return productDTOList;
    }

    // Update Product.............

    public ProductDTO updateProduct(ProductDTO productDTO) {
        if (productDTO.getProductId() == null) {
            throw new RuntimeException("Product ID is required for update.");
        }

        Optional<Product> productOptional = productRepository.findById(productDTO.getProductId());

        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            product.setProductName(productDTO.getProductName());
            product.setProductPrice(productDTO.getProductPrice());
            product.setProductDescription(productDTO.getProductDescription());
            product.setCategoryId(productDTO.getCategoryId());

            // Handle updates for card images
            boolean newCardFilesProvided = productDTO.getCardImages() != null && !productDTO.getCardImages().isEmpty();
            boolean cardUrlsProvided = productDTO.getCardImageUrls() != null;

            if (newCardFilesProvided || cardUrlsProvided) {
                List<String> newCardImages = new ArrayList<>();
                if (cardUrlsProvided) {
                    newCardImages.addAll(productDTO.getCardImageUrls());
                }
                if (newCardFilesProvided) {
                    processImages(productDTO.getCardImages(), newCardImages);
                }
                product.setCardImageURLs(newCardImages);
            }

            // Handle updates for detail images
            boolean newDetailFilesProvided = productDTO.getDetailImages() != null
                    && !productDTO.getDetailImages().isEmpty();
            boolean detailUrlsProvided = productDTO.getDetailImageUrls() != null;

            if (newDetailFilesProvided || detailUrlsProvided) {
                List<String> newDetailImages = new ArrayList<>();
                if (detailUrlsProvided) {
                    newDetailImages.addAll(productDTO.getDetailImageUrls());
                }
                if (newDetailFilesProvided) {
                    processImages(productDTO.getDetailImages(), newDetailImages);
                }
                product.setDetailImageURLs(newDetailImages);
            }

            productRepository.save(product);
            return convertProducttoProductDTO(product);
        } else {
            throw new RuntimeException("Product not found with ID: " + productDTO.getProductId());
        }
    }

    // delete product...........

    public String deleteProduct(String productId) {
        Optional<Product> productOptional = productRepository.findById(productId);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            String productName = product.getProductName();
            productRepository.deleteById(productId);
            return productName + " Deleted Successfully";
        }
        return "Product Not Found";
    }

    // convert product to productDTO's for get from database........

    public ProductDTO convertProducttoProductDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();

        productDTO.setProductId(product.getProductId());
        productDTO.setProductName(product.getProductName());
        productDTO.setProductPrice(product.getProductPrice());
        productDTO.setProductDescription(product.getProductDescription());
        productDTO.setCategoryId(product.getCategoryId());
        productDTO.setCardImageUrls(product.getCardImageURLs());
        productDTO.setDetailImageUrls(product.getDetailImageURLs());

        return productDTO;
    }

    // convert productDTO's to product for store in database........

    public Product convertProductDTOtoProduct(ProductDTO productDTO) throws IOException {
        Product product = new Product();

        product.setProductName(productDTO.getProductName());
        product.setProductPrice(productDTO.getProductPrice());
        product.setProductDescription(productDTO.getProductDescription());
        product.setCategoryId(productDTO.getCategoryId());

        // Log card images reception
        if (productDTO.getCardImages() != null) {
            System.out.println("Processing " + productDTO.getCardImages().size() + " card images.");
        } else {
            System.out.println("No card images received (null).");
        }

        List<String> cardImageUrls = new ArrayList<>();
        if (productDTO.getCardImages() != null) {
            for (MultipartFile file : productDTO.getCardImages()) {
                if (!file.isEmpty()) {
                    String fileName = saveImage(file);
                    // Store full URL so frontend can use it directly
                    cardImageUrls.add(imageBaseUrl + fileName);
                }
            }
        }
        System.out.println("Setting Card Image URLs: " + cardImageUrls);
        product.setCardImageURLs(cardImageUrls);

        List<String> detailImageUrls = new ArrayList<>();
        if (productDTO.getDetailImages() != null) {
            for (MultipartFile file : productDTO.getDetailImages()) {
                if (!file.isEmpty()) {
                    String fileName = saveImage(file);
                    detailImageUrls.add(imageBaseUrl + fileName);
                }
            }
        }
        product.setDetailImageURLs(detailImageUrls);

        return product;

    }

    private void processImages(List<MultipartFile> newFiles, List<String> currentUrls) {
        try {
            for (MultipartFile file : newFiles) {
                if (!file.isEmpty()) {
                    String fileName = saveImage(file);
                    currentUrls.add(imageBaseUrl + fileName);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to update product images", e);
        }
    }

    private String saveImage(MultipartFile file) throws IOException {

        // Create the directory if it doesn't exist

        Path uploadPath = Paths.get(IMAGE_UPLOAD_DIRECTORY);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique name for the image to avoid overwriting

        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName);

        // Save the file bytes

        Files.copy(file.getInputStream(), filePath);

        return uniqueFileName;
    }
}
