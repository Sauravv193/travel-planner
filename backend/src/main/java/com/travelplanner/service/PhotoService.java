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
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoService {

    private static final long MAX_PHOTO_BYTES = 10L * 1024 * 1024;
    private static final int MAX_PHOTOS_PER_REQUEST = 4;

    @Autowired private PhotoRepository photoRepository;
    @Autowired private TripRepository tripRepository;

    @Value("${app.photo.upload.dir:./uploads/photos}")
    private String uploadDir;

    @Transactional
    public List<Photo> uploadPhotos(Long tripId, MultipartFile[] files, Long userId) throws IOException {
        Trip trip = tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Trip not found or user not authorized."));

        if (files == null || files.length == 0 || files.length > MAX_PHOTOS_PER_REQUEST) {
            throw new IllegalArgumentException("Upload between 1 and " + MAX_PHOTOS_PER_REQUEST + " photos per request.");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        List<Photo> uploadedPhotos = new ArrayList<>();

        // Validate every file before writing any of them.
        List<byte[]> contents = new ArrayList<>();
        List<String> mimeTypes = new ArrayList<>();
        List<String> extensions = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("Empty photo files are not allowed.");
            }
            if (file.getSize() > MAX_PHOTO_BYTES) {
                throw new IllegalArgumentException("Each photo must be 10 MB or smaller.");
            }

            byte[] bytes = file.getBytes();
            String detectedType = detectImageType(bytes);
            if (detectedType == null) {
                throw new IllegalArgumentException("Only valid JPEG, PNG, GIF, and WebP images are accepted.");
            }
            String declaredType = file.getContentType();
            if (declaredType != null && !declaredType.equalsIgnoreCase(detectedType)
                    && !declaredType.equalsIgnoreCase("application/octet-stream")) {
                throw new IllegalArgumentException("Photo content type does not match its image data.");
            }
            contents.add(bytes);
            mimeTypes.add(detectedType);
            extensions.add(extensionFor(detectedType));
        }

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            String uniqueFilename = UUID.randomUUID() + extensions.get(i);
            Path filePath = uploadPath.resolve(uniqueFilename).normalize();
            if (!filePath.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Invalid upload path.");
            }

            Files.write(filePath, contents.get(i), StandardOpenOption.CREATE_NEW);
            Photo photo = new Photo();
            photo.setTrip(trip);
            photo.setOriginalName(safeOriginalName(file.getOriginalFilename()));
            photo.setFileName(uniqueFilename);
            photo.setFilePath(filePath.toString());
            photo.setFileSize((long) contents.get(i).length);
            photo.setMimeType(mimeTypes.get(i));
            photo.setUploadTime(LocalDateTime.now());
            uploadedPhotos.add(photoRepository.save(photo));
        }
        return uploadedPhotos;
    }

    private String detectImageType(byte[] bytes) {
        if (bytes.length >= 3 && (bytes[0] & 0xFF) == 0xFF
                && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) return "image/jpeg";
        if (bytes.length >= 8 && (bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50
                && bytes[2] == 0x4E && bytes[3] == 0x47
                && bytes[4] == 0x0D && bytes[5] == 0x0A
                && bytes[6] == 0x1A && bytes[7] == 0x0A) return "image/png";
        if (bytes.length >= 6 && bytes[0] == 0x47 && bytes[1] == 0x49
                && bytes[2] == 0x46 && bytes[3] == 0x38
                && (bytes[4] == 0x37 || bytes[4] == 0x39) && bytes[5] == 0x61) return "image/gif";
        if (bytes.length >= 12 && bytes[0] == 0x52 && bytes[1] == 0x49
                && bytes[2] == 0x46 && bytes[3] == 0x46
                && bytes[8] == 0x57 && bytes[9] == 0x45
                && bytes[10] == 0x42 && bytes[11] == 0x50) return "image/webp";
        return null;
    }

    private String extensionFor(String mimeType) {
        switch (mimeType) {
            case "image/jpeg": return ".jpg";
            case "image/png": return ".png";
            case "image/gif": return ".gif";
            case "image/webp": return ".webp";
            default: throw new IllegalArgumentException("Unsupported image type.");
        }
    }

    private String safeOriginalName(String originalName) {
        if (originalName == null || originalName.isBlank()) return "photo";
        String name = Paths.get(originalName).getFileName().toString().replaceAll("[\\r\\n\\p{Cntrl}]", "");
        return name.length() > 150 ? name.substring(0, 150) : name;
    }

    @Transactional(readOnly = true)
    public List<Photo> getPhotosForTrip(Long tripId, Long userId) {
        tripRepository.findById(tripId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Trip not found or user not authorized."));
        return photoRepository.findByTripId(tripId);
    }

    @Transactional
    public void deletePhoto(Long photoId, Long userId) {
        Photo photo = getPhotoById(photoId, userId);
        try {
            Files.deleteIfExists(Paths.get(photo.getFilePath()).toAbsolutePath().normalize());
        } catch (IOException e) {
            throw new IllegalStateException("Could not remove stored photo file.", e);
        }
        photoRepository.delete(photo);
    }

    @Transactional(readOnly = true)
    public Photo getPhotoById(Long photoId, Long userId) {
        return photoRepository.findById(photoId)
                .filter(p -> p.getTrip().getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Photo not found or user not authorized."));
    }

    @Transactional(readOnly = true)
    public byte[] getPhotoData(Long photoId, Long userId) throws IOException {
        Photo photo = getPhotoById(photoId, userId);
        Path filePath = Paths.get(photo.getFilePath()).toAbsolutePath().normalize();
        if (!Files.isRegularFile(filePath)) {
            throw new RuntimeException("Photo file is unavailable.");
        }
        return Files.readAllBytes(filePath);
    }
}
