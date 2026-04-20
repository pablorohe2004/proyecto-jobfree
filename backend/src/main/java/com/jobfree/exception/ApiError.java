package com.jobfree.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime timestamp;
    private final int status;
    private final String error;
    private final String message;
    private final String path;
    private final List<String> errors;

    private ApiError(Builder builder) {
        this.timestamp = builder.timestamp;
        this.status    = builder.status;
        this.error     = builder.error;
        this.message   = builder.message;
        this.path      = builder.path;
        this.errors    = builder.errors;
    }

    public static Builder builder() {
        return new Builder();
    }

    public LocalDateTime getTimestamp() { return timestamp; }
    public int           getStatus()    { return status;    }
    public String        getError()     { return error;     }
    public String        getMessage()   { return message;   }
    public String        getPath()      { return path;      }
    public List<String>  getErrors()    { return errors;    }

    public static class Builder {
        private LocalDateTime timestamp = LocalDateTime.now();
        private int           status;
        private String        error;
        private String        message;
        private String        path;
        private List<String>  errors;

        public Builder status(int status)           { this.status = status;     return this; }
        public Builder error(String error)          { this.error = error;       return this; }
        public Builder message(String message)      { this.message = message;   return this; }
        public Builder path(String path)            { this.path = path;         return this; }
        public Builder errors(List<String> errors)  { this.errors = errors;     return this; }

        public ApiError build() { return new ApiError(this); }
    }
}
