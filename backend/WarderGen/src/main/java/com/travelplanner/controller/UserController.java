package com.travelplanner.controller;

import com.travelplanner.model.User;
import com.travelplanner.security.services.UserDetailsImpl;
import com.travelplanner.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.getUserProfile(userDetails.getId());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody User updatedUser) {
        User user = userService.updateUserProfile(userDetails.getId(), updatedUser);
        return ResponseEntity.ok(user);
    }
}