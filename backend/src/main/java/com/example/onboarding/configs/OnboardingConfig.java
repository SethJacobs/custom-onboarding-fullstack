package com.example.onboarding.configs;

import jakarta.persistence.*;

@Entity
@Table(name = "onboarding_config")
public class OnboardingConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PageComponent page2ComponentA;
    @Enumerated(EnumType.STRING)
    private PageComponent page2ComponentB; // optional

    @Enumerated(EnumType.STRING)
    private PageComponent page3ComponentA;
    @Enumerated(EnumType.STRING)
    private PageComponent page3ComponentB; // optional

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PageComponent getPage2ComponentA() { return page2ComponentA; }
    public void setPage2ComponentA(PageComponent page2ComponentA) { this.page2ComponentA = page2ComponentA; }

    public PageComponent getPage2ComponentB() { return page2ComponentB; }
    public void setPage2ComponentB(PageComponent page2ComponentB) { this.page2ComponentB = page2ComponentB; }

    public PageComponent getPage3ComponentA() { return page3ComponentA; }
    public void setPage3ComponentA(PageComponent page3ComponentA) { this.page3ComponentA = page3ComponentA; }

    public PageComponent getPage3ComponentB() { return page3ComponentB; }
    public void setPage3ComponentB(PageComponent page3ComponentB) { this.page3ComponentB = page3ComponentB; }
}
