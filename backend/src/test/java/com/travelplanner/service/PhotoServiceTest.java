package com.travelplanner.service;

import com.travelplanner.model.Photo;
import com.travelplanner.model.Trip;
import com.travelplanner.model.User;
import com.travelplanner.repository.PhotoRepository;
import com.travelplanner.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PhotoServiceTest {

    @TempDir Path tempDir;

    @Mock private PhotoRepository photoRepository;
    @Mock private TripRepository tripRepository;
    @Mock private PhotoStorageService photoStorageService;
    @InjectMocks private PhotoService photoService;

    private Trip ownedTrip;
    private final Long userId = 7L;

    @BeforeEach
    void setUp() {
        User owner = new User("owner", "owner@example.com", "password");
        owner.setId(userId);
        ownedTrip = new Trip();
        ownedTrip.setId(42L);
        ownedTrip.setUser(owner);
        when(tripRepository.findById(42L)).thenReturn(Optional.of(ownedTrip));
    }

    private MockMultipartFile png(String name) {
        byte[] signature = new byte[] {
                (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
                0x00, 0x00, 0x00, 0x00
        };
        return new MockMultipartFile("files", name, "image/png", signature);
    }

    @Test
    void uploadPhotosAcceptsRecognizedImageAndUsesGeneratedFilename() throws Exception {
        when(photoStorageService.store(anyString(), any(byte[].class), anyString()))
                .thenReturn(tempDir.resolve("photos").resolve("stored.png").toString());
        when(photoRepository.save(any(Photo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = photoService.uploadPhotos(42L,
                new org.springframework.web.multipart.MultipartFile[] { png("C:\\fakepath\\holiday.png") },
                userId);

        assertEquals(1, result.size());
        Photo saved = result.get(0);
        assertEquals("holiday.png", saved.getOriginalName());
        assertTrue(saved.getFileName().endsWith(".png"));
        assertNotEquals("holiday.png", saved.getFileName());
        assertTrue(saved.getFilePath().endsWith("stored.png"));
        verify(photoStorageService).store(anyString(), any(byte[].class), eq("image/png"));
        assertEquals("image/png", saved.getMimeType());
    }

    @Test
    void uploadPhotosRejectsUnsupportedFileContent() {
        MockMultipartFile textFile = new MockMultipartFile(
                "files", "notes.txt", "text/plain", "not an image".getBytes());

        assertThrows(IllegalArgumentException.class,
                () -> photoService.uploadPhotos(42L,
                        new org.springframework.web.multipart.MultipartFile[] { textFile }, userId));
        verify(photoRepository, never()).save(any(Photo.class));
    }

    @Test
    void uploadPhotosRejectsMimeTypeThatDoesNotMatchSignature() throws Exception {
        MockMultipartFile mislabeled = new MockMultipartFile(
                "files", "photo.jpg", "image/jpeg", png("photo.png").getBytes());

        assertThrows(IllegalArgumentException.class,
                () -> photoService.uploadPhotos(42L,
                        new org.springframework.web.multipart.MultipartFile[] { mislabeled }, userId));
        verify(photoRepository, never()).save(any(Photo.class));
    }

    @Test
    void uploadPhotosRejectsMoreThanFourFiles() {
        org.springframework.web.multipart.MultipartFile[] files = {
                png("1.png"), png("2.png"), png("3.png"), png("4.png"), png("5.png")
        };

        assertThrows(IllegalArgumentException.class,
                () -> photoService.uploadPhotos(42L, files, userId));
        verify(photoRepository, never()).save(any(Photo.class));
    }

    @Test
    void uploadPhotosRemovesFilesIfDatabaseSaveFails() throws Exception {
        when(photoStorageService.store(anyString(), any(byte[].class), anyString()))
                .thenReturn(tempDir.resolve("photos").resolve("stored.png").toString());
        when(photoRepository.save(any(Photo.class))).thenThrow(new IllegalStateException("database unavailable"));

        assertThrows(IllegalStateException.class,
                () -> photoService.uploadPhotos(42L,
                        new org.springframework.web.multipart.MultipartFile[] { png("photo.png") }, userId));

        verify(photoStorageService).delete(tempDir.resolve("photos").resolve("stored.png").toString());
    }

    @Test
    void uploadPhotosRejectsTripOwnedByAnotherUser() {
        User anotherOwner = new User("another", "another@example.com", "password");
        anotherOwner.setId(99L);
        ownedTrip.setUser(anotherOwner);

        assertThrows(RuntimeException.class,
                () -> photoService.uploadPhotos(42L,
                        new org.springframework.web.multipart.MultipartFile[] { png("photo.png") }, userId));
        verify(photoRepository, never()).save(any(Photo.class));
    }
}
