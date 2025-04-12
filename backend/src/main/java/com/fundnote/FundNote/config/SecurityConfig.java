package com.fundnote.FundNote.config;

import com.fundnote.FundNote.Firebase.FirebaseTokenFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {

    @Bean
    public FilterRegistrationBean<FirebaseTokenFilter> firebaseFilter(FirebaseTokenFilter filter) {
        FilterRegistrationBean<FirebaseTokenFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(filter);
        registration.addUrlPatterns("/api/*");
        return registration;
    }
}
