package net.fuzzyhome.home.config;

import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class WebConfig implements WebMvcConfigurer {

    private final WebConfigProperties webConfigProperties;

    @Override
    public void addCorsMappings(final @NonNull CorsRegistry registry) {
        if (webConfigProperties.isEnabled()) {
            log.warn(
                "Allow requests from the following origins: {}",
                Arrays.asList(webConfigProperties.getAllowedOrigins())
            );
            final var CorsRegistration = registry.addMapping("/**");
            CorsRegistration.allowedOrigins(webConfigProperties.getAllowedOrigins());
        }
    }
}
