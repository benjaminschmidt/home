package net.fuzzyhome.home.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class WebConfig implements WebMvcConfigurer {

    private final WebConfigProperties webConfigProperties;

    @Bean
    JsonMapperBuilderCustomizer jsonMapperBuilderCustomizer() {
        return builder -> builder.changeDefaultPropertyInclusion(ignored -> JsonInclude.Value.construct(
            JsonInclude.Include.NON_NULL,
            JsonInclude.Include.ALWAYS
        ));
    }

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
