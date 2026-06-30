package com.travelplanner.service;

import com.travelplanner.model.Photo;
import com.travelplanner.model.Trip;
import com.travelplanner.repository.PhotoRepository;
import com.travelplanner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private TripRepository tripRepository;

    @Value("${app.photo.upload.dir:./uploads/photos}")
    private String uploadDir;

    @Transactional
    public List<Photo> uploadPhotos(Long tripId, MultipartFile[] files, Long userId) throws IOException {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Trip not found or user not authorized."));

        List<Photo> uploadedPhotos = new ArrayList<>();
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : "";
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                
                // Save file to disk
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Create Photo entity
                Photo photo = new Photo();
                photo.setTrip(trip);
                photo.setOriginalName(originalFilename);
                photo.setFileName(uniqueFilename);
                photo.setFilePath(filePath.toString());
                photo.setFileSize(file.getSize());
                photo.setMimeType(file.getContentType());
                photo.setUploadTime(LocalDateTime.now());
                
                uploadedPhotos.add(photoRepository.save(photo));
            }
        }
        
        return uploadedPhotos;
    }

    @Transactional(readOnly = true)
    public List<Photo> getPhotosForTrip(Long tripId, Long userId) {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Trip not found or user not authorized."));
                
        return photoRepository.findByTripId(tripId);
    }

    @Transactional
    public void deletePhoto(Long photoId, Long userId) {
        Photo photo = photoRepository.findById(photoId)
                .filter(p -> p.getTrip().getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Photo not found or user not authorized."));
        
        // Delete file from disk
        try {
            Path filePath = Paths.get(photo.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log the error but don't fail the deletion
            System.err.println("Failed to delete file: " + photo.getFilePath());
        }
        
        // Delete from database
        photoRepository.delete(photo);
    }

    public Photo getPhotoById(Long photoId, Long userId) {
        return photoRepository.findById(photoId)
                .filter(p -> p.getTrip().getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Photo not found or user not authorized."));
    }

    public byte[] getPhotoData(Long photoId, Long userId) throws IOException {
        Photo photo = getPhotoById(photoId, userId);
        
        Path filePath = Paths.get(photo.getFilePath());
        if (!Files.exists(filePath)) {
            throw new RuntimeException("Photo file not found on disk: " + photo.getOriginalName());
        }
        
        return Files.readAllBytes(filePath);
    }
}