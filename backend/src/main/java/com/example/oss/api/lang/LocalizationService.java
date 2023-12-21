package com.example.oss.api.lang;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Component;

@Component
public class LocalizationService {
    private static ResourceBundleMessageSource messageSource;

    @Autowired
    public LocalizationService(ResourceBundleMessageSource messageSource) {
        LocalizationService.messageSource = messageSource;
    }

    public static String toLocale(String msgCode, Object... args) {
        return messageSource.getMessage(msgCode, args, LocaleContextHolder.getLocale());
    }

    public static String toLocale(String msgCode) {
        return messageSource.getMessage(msgCode, null, LocaleContextHolder.getLocale());
    }
}
