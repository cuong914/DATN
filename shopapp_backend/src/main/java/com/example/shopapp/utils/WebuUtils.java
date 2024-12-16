package com.example.shopapp.utils;

import jakarta.servlet.ServletRequestAttributeListener;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class WebuUtils {
    public static HttpServletRequest getcurrentRequest(){// hàm này trả về request hiệnt tại
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    }
}
