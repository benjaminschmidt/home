package net.fuzzyhome.home.rest;

import net.fuzzyhome.home.services.errors.BadRequestException;
import net.fuzzyhome.home.services.errors.NotFoundException;
import org.jspecify.annotations.NonNull;
import org.openapitools.model.ErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

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
}
