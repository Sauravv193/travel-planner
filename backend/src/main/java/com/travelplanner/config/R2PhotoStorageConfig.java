package com.travelplanner.config;

import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
@ConditionalOnProperty(prefix = "app.photo.storage", name = "provider", havingValue = "r2")
public class R2PhotoStorageConfig {

    @Bean(destroyMethod = "close")
    public S3Client photoS3Client(
            @Value("${app.photo.storage.endpoint:}") String endpoint,
            @Value("${app.photo.storage.access-key:}") String accessKey,
            @Value("${app.photo.storage.secret-key:}") String secretKey,
            @Value("${app.photo.storage.bucket:}") String bucket,
            @Value("${app.photo.storage.region:auto}") String region) {
        Assert.hasText(endpoint, "R2 endpoint is required when PHOTO_STORAGE_PROVIDER=r2");
        Assert.hasText(accessKey, "R2 access key is required when PHOTO_STORAGE_PROVIDER=r2");
        Assert.hasText(secretKey, "R2 secret key is required when PHOTO_STORAGE_PROVIDER=r2");
        Assert.hasText(bucket, "R2 bucket is required when PHOTO_STORAGE_PROVIDER=r2");
        return S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                .build();
    }
}
