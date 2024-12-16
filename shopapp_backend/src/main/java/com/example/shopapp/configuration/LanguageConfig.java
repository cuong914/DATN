package com.example.shopapp.configuration;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;

@Configuration
public class LanguageConfig {

    @Bean
    public MessageSource messageSource(){ // cho bt nơi nào chứa tệp đa ngôn ngữ
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("i18n.message");// tên cơ sở của các tệp ngôn ngữ
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;

    }

}