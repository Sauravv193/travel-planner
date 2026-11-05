package com.travelplanner.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class PhotoStorageService {

    @Autowired(required = false)
    private S3Client s3Client;

    @Value("${app.photo.storage.provider:local}")
    private String provider;

    @Value("${app.photo.storage.bucket:}")
    private String bucket;

    @Value("${app.photo.upload.dir:./uploads/photos}")
    private String uploadDir;

    public String store(String objectKey, byte[] content, String contentType) throws IOException {
        if ("r2".equalsIgnoreCase(provider)) {
            requireR2Configuration();
            s3Client.putObject(PutObjectRequest.builder()
                    .bucket(bucket).key(objectKey).contentType(contentType).build(),
                    RequestBody.fromBytes(content));
            return "r2:" + objectKey;
        }

        Path root = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(root);
        Path destination = root.resolve(objectKey).normalize();
        if (!destination.startsWith(root)) {
            throw new IllegalArgumentException("Invalid photo object key.");
        }
        try {
            Files.write(destination, content, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
            return destination.toString();
        } catch (IOException e) {
            Files.deleteIfExists(destination);
            throw e;
        }
    }

    public byte[] read(String storageReference) throws IOException {
        if (storageReference != null && storageReference.startsWith("r2:")) {
            requireR2Configuration();
            String key = storageReference.substring(3);
            return s3Client.getObjectAsBytes(GetObjectRequest.builder()
                    .bucket(bucket).key(key).build()).asByteArray();
        }
        if (storageReference == null || storageReference.isBlank()) {
            throw new IOException("Photo storage reference is missing.");
        }
        Path path = Paths.get(storageReference).toAbsolutePath().normalize();
        if (!Files.isRegularFile(path)) {
            throw new IOException("Stored photo is unavailable.");
        }
        return Files.readAllBytes(path);
    }

    public void delete(String storageReference) throws IOException {
        if (storageReference == null || storageReference.isBlank()) return;
        if (storageReference.startsWith("r2:")) {
            requireR2Configuration();
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucket).key(storageReference.substring(3)).build());
            return;
        }
        Files.deleteIfExists(Paths.get(storageReference).toAbsolutePath().normalize());
    }

    private void requireR2Configuration() {
        Assert.notNull(s3Client, "R2 storage client is not configured.");
        Assert.hasText(bucket, "R2 bucket is required when PHOTO_STORAGE_PROVIDER=r2");
    }
}
