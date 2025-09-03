package com.example.onboarding.configs;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initConfig(OnboardingConfigRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                OnboardingConfig cfg = new OnboardingConfig();
                // Defaults: Page 2 -> ABOUT_ME, Page 3 -> ADDRESS
                cfg.setPage2ComponentA(PageComponent.ABOUT_ME);
                cfg.setPage3ComponentA(PageComponent.ADDRESS);
                repo.save(cfg);
            }
        };
    }
}
