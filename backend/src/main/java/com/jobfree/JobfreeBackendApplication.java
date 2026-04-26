package com.jobfree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class JobfreeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobfreeBackendApplication.class, args);
	}

}
