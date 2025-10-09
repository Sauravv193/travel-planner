package com.travelplanner.controller;

import com.travelplanner.model.Photo;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    @Autowired
    private PhotoService photoService;

    @PostMapping("/upload/{tripId}")
    public ResponseEntity<List<Photo>> uploadPhotos(
            @PathVariable Long tripId,
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<Photo> uploadedPhotos = photoService.uploadPhotos(tripId, files, userDetails.getId());
            return ResponseEntity.ok(uploadedPhotos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Photo>> getPhotosForTrip(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<Photo> photos = photoService.getPhotosForTrip(tripId, userDetails.getId());
            return ResponseEntity.ok(photos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            photoService.deletePhoto(photoId, userDetails.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/serve/{photoId}")
    public ResponseEntity<Resource> servePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            byte[] photoData = photoService.getPhotoData(photoId, userDetails.getId());
            ByteArrayResource resource = new ByteArrayResource(photoData);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // Default, can be enhanced to detect actual type
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
