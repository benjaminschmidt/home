package net.fuzzyhome.home.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.cors")
@Data
public class WebConfigProperties {
    private boolean enabled = false;
    private String[] allowedOrigins = {};
}
