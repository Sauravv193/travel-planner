package com.travelplanner.service;

import static org.junit.jupiter.api.Assertions.*;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.test.util.ReflectionTestUtils;

class PhotoStorageServiceTest {
    @TempDir Path tempDir;

    @Test
    void localStorageCanStoreReadAndDeletePhoto() throws Exception {
        PhotoStorageService storage = new PhotoStorageService();
        ReflectionTestUtils.setField(storage, "provider", "local");
        ReflectionTestUtils.setField(storage, "uploadDir", tempDir.resolve("photos").toString());

        byte[] original = new byte[] { 1, 2, 3, 4 };
        String reference = storage.store("photo.png", original, "image/png");

        assertArrayEquals(original, storage.read(reference));
        assertTrue(Files.isRegularFile(Path.of(reference)));
        storage.delete(reference);
        assertFalse(Files.exists(Path.of(reference)));
    }
}
