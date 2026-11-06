package net.fuzzyhome.home.rest;

import jakarta.validation.ConstraintViolationException;
import java.util.Set;
import net.fuzzyhome.home.services.errors.BadRequestException;
import net.fuzzyhome.home.services.errors.NotFoundException;
import org.junit.jupiter.api.Test;
import org.openapitools.model.ErrorDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void preserves_safe_bad_request_message() {
        final var response = handler.handleBadRequestException(new BadRequestException("Invalid conversion"));

        assertThat(response)
            .extracting(ResponseEntity::getStatusCode, this::message)
            .containsExactly(HttpStatus.BAD_REQUEST, "Invalid conversion");
    }

    @Test
    void preserves_safe_not_found_message() {
        final var response = handler.handleNotFoundException(new NotFoundException("Ingredient not found"));

        assertThat(response)
            .extracting(ResponseEntity::getStatusCode, this::message)
            .containsExactly(HttpStatus.NOT_FOUND, "Ingredient not found");
    }

    @Test
    void hides_data_integrity_details() {
        final var response = handler.handleDataIntegrityViolationException(
            new DataIntegrityViolationException("duplicate key value reveals database details")
        );

        assertThat(response)
            .extracting(ResponseEntity::getStatusCode, this::message)
            .containsExactly(
                HttpStatus.BAD_REQUEST,
                "The request conflicts with existing data."
            );
        assertThat(message(response)).doesNotContain("database details");
    }

    @Test
    void returns_safe_validation_message() {
        final var response = handler.handleValidationException(
            new ConstraintViolationException("validation details", Set.of())
        );

        assertThat(response)
            .extracting(ResponseEntity::getStatusCode, this::message)
            .containsExactly(HttpStatus.BAD_REQUEST, "The request contains invalid data.");
    }

    @Test
    void hides_unexpected_exception_details() {
        final var response = handler.handleUnexpectedException(new RuntimeException("secret details"));

        assertThat(response)
            .extracting(ResponseEntity::getStatusCode, this::message)
            .containsExactly(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
        assertThat(message(response)).doesNotContain("secret details");
    }

    private String message(final ResponseEntity<ErrorDto> response) {
        return response.getBody().getMessage();
    }
}
