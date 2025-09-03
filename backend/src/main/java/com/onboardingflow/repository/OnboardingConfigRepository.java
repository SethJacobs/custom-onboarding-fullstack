package com.onboardingflow.repository;

import com.onboardingflow.schema.OnboardingConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OnboardingConfigRepository extends JpaRepository<OnboardingConfig, Long> {
}