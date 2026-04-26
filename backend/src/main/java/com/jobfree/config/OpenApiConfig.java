package com.jobfree.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI jobFreeOpenAPI() {
        final String schemeName = "cookieAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("JobFree API")
                        .version("1.0.0")
                        .description("API REST de la plataforma JobFree para contratación de servicios domésticos")
                        .contact(new Contact()
                                .name("Equipo JobFree")
                                .email("pablorh20042007redes@gmail.com")))
                .addSecurityItem(new SecurityRequirement().addList(schemeName))
                .components(new Components()
                        .addSecuritySchemes(schemeName, new SecurityScheme()
                                .name("JSESSIONID")
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .description("JWT almacenado en cookie httpOnly")));
    }
}
