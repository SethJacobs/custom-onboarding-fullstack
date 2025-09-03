package com.example.onboarding.configs;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private final OnboardingConfigRepository repo;

    public ConfigController(OnboardingConfigRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<?> get() {
        Optional<OnboardingConfig> oc = repo.findAll().stream().findFirst();
        return ResponseEntity.ok(oc.orElseGet(OnboardingConfig::new));
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody @Valid OnboardingConfig cfg) {
        // enforce: each of page 2 and 3 must have at least one component
        if ((cfg.getPage2ComponentA() == null && cfg.getPage2ComponentB() == null) ||
            (cfg.getPage3ComponentA() == null && cfg.getPage3ComponentB() == null)) {
            return ResponseEntity.badRequest().body("Each of page 2 and 3 must have at least one component");
        }
        // prevent duplicates on a page
        if (cfg.getPage2ComponentA() != null && cfg.getPage2ComponentB() != null &&
            cfg.getPage2ComponentA() == cfg.getPage2ComponentB()) {
            return ResponseEntity.badRequest().body("Page 2 components must be unique");
        }
        if (cfg.getPage3ComponentA() != null && cfg.getPage3ComponentB() != null &&
            cfg.getPage3ComponentA() == cfg.getPage3ComponentB()) {
            return ResponseEntity.badRequest().body("Page 3 components must be unique");
        }

        // store as single row
        Optional<OnboardingConfig> existingOpt = repo.findAll().stream().findFirst();
        OnboardingConfig toSave = existingOpt.orElseGet(OnboardingConfig::new);
        toSave.setPage2ComponentA(cfg.getPage2ComponentA());
        toSave.setPage2ComponentB(cfg.getPage2ComponentB());
        toSave.setPage3ComponentA(cfg.getPage3ComponentA());
        toSave.setPage3ComponentB(cfg.getPage3ComponentB());
        repo.save(toSave);
        return ResponseEntity.ok(toSave);
    }
}
