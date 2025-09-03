package com.onboardingflow.api;

import com.onboardingflow.dto.LoginRequest;
import com.onboardingflow.dto.RegisterRequest;
import com.onboardingflow.dto.UpdateUserRequest;
import com.onboardingflow.util.CookieUtil;
import com.onboardingflow.schema.User;
import com.onboardingflow.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req, HttpServletResponse response) {
        Optional<User> existing = repo.findByEmail(req.getEmail());
        if (existing.isPresent()) {
            // Email exists, try to log them in instead
            User u = existing.get();
            if (!BCrypt.checkpw(req.getPassword(), u.getPasswordHash())) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            CookieUtil.setUidCookie(response, u.getId());
            return ResponseEntity.ok(u);
        }
        // New user registration
        User u = new User();
        u.setEmail(req.getEmail());
        u.setPasswordHash(BCrypt.hashpw(req.getPassword(), BCrypt.gensalt()));
        u.setCurrentStep(1);
        repo.save(u);
        CookieUtil.setUidCookie(response, u.getId());
        return ResponseEntity.ok(u);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
        Optional<User> existing = repo.findByEmail(req.getEmail());
        if (existing.isEmpty()) return ResponseEntity.status(401).body("Invalid credentials");
        User u = existing.get();
        if (!BCrypt.checkpw(req.getPassword(), u.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        CookieUtil.setUidCookie(response, u.getId());
        return ResponseEntity.ok(u);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        Long uid = getUidFromCookie(request);
        if (uid == null) return ResponseEntity.status(401).body("No uid cookie");
        return repo.findById(uid).<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody UpdateUserRequest req, HttpServletRequest request) {
        Long uid = getUidFromCookie(request);
        
        if (uid == null){ 
            return ResponseEntity.status(401).body("No uid cookie");
        }

        Optional<User> ou = repo.findById(uid);
        if (ou.isEmpty()) {
             return ResponseEntity.status(404).body("User not found");
        }

        User u = ou.get();

        if (req.getAboutMe() != null) { 
            u.setAboutMe(req.getAboutMe());
        }
        if (req.getStreet() != null) {
            u.setStreet(req.getStreet());
        } 
        if (req.getCity() != null) { 
            u.setCity(req.getCity());
        }
        if (req.getState() != null) {
            u.setState(req.getState());
        }
        if (req.getZip() != null) {
            u.setZip(req.getZip());
        }
        if (req.getBirthdate() != null) {
            u.setBirthdate(req.getBirthdate());
        }
        if (req.getCurrentStep() != null) {
            u.setCurrentStep(req.getCurrentStep());
        }

        repo.save(u);
        return ResponseEntity.ok(u);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        CookieUtil.clearUidCookie(response);
        return ResponseEntity.ok(java.util.Map.of("message", "Logged out successfully"));
    }

    @GetMapping
    public List<User> list() {
        return repo.findAll();
    }

    private Long getUidFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie c : request.getCookies()) {
            if ("uid".equals(c.getName())) {
                try { 
                    return Long.parseLong(c.getValue()); 
                } catch (Exception e) { 
                    return null; 
                }
            }
        }
        return null;
    }
}