package com.example.shopapp.utils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class LocallizationUtils {

    private final LocaleResolver localeResolver;
    private final MessageSource messageSource;
    public  String getLocallizeMessage(String messageKey, Object ... params){ //Object ... params<spread operator>  : tức là trong này cái param này có thể có 1,2,3 cái
        HttpServletRequest request = WebuUtils.getcurrentRequest();
        Locale locale = localeResolver.resolveLocale(request);
        return messageSource.getMessage(messageKey,params,locale);
    }
}
