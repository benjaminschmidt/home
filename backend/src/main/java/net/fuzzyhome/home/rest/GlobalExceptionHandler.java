package net.fuzzyhome.home.rest;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import net.fuzzyhome.home.services.errors.BadRequestException;
import net.fuzzyhome.home.services.errors.NotFoundException;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.ErrorDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String DATA_INTEGRITY_ERROR_MESSAGE = "The request conflicts with existing data.";
    private static final String VALIDATION_ERROR_MESSAGE = "The request contains invalid data.";
    private static final String INTERNAL_ERROR_MESSAGE = "An unexpected error occurred.";

    @ExceptionHandler(BadRequestException.class)
    @NonNull
    public ResponseEntity<@NonNull ErrorDto> handleBadRequestException(
        @NonNull final BadRequestException badRequestException
    ) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorDto.builder()
                .message(badRequestException.getMessage())
                .build());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @NonNull
    public ResponseEntity<@NonNull ErrorDto> handleDataIntegrityViolationException(
        @NonNull final DataIntegrityViolationException dataIntegrityViolationException
    ) {
        log.warn("Request failed because of a data integrity violation", dataIntegrityViolationException);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorDto.builder()
                .message(DATA_INTEGRITY_ERROR_MESSAGE)
                .build());
    }

    @ExceptionHandler(NotFoundException.class)
    @NonNull
    public ResponseEntity<@NonNull ErrorDto> handleNotFoundException(
        @NonNull final NotFoundException notFoundException
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorDto.builder()
                .message(notFoundException.getMessage())
                .build());
    }

    @ExceptionHandler({
        ConstraintViolationException.class,
        HandlerMethodValidationException.class,
        HttpMessageNotReadableException.class,
        MethodArgumentNotValidException.class,
        MissingServletRequestParameterException.class,
        MethodArgumentTypeMismatchException.class
    })
    @NonNull
    public ResponseEntity<@NonNull ErrorDto> handleValidationException(
        @NonNull final Exception validationException
    ) {
        log.debug("Request validation failed", validationException);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorDto.builder()
                .message(VALIDATION_ERROR_MESSAGE)
                .build());
    }

    @ExceptionHandler(Exception.class)
    @NonNull
    public ResponseEntity<@NonNull ErrorDto> handleUnexpectedException(
        @NonNull final Exception exception
    ) {
        log.error("Unexpected error while processing request", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorDto.builder()
                .message(INTERNAL_ERROR_MESSAGE)
                .build());
    }
}
