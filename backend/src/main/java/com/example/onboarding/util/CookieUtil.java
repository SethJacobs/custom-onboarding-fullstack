package com.example.onboarding.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {
    public static void setUidCookie(HttpServletResponse response, Long userId) {
        Cookie c = new Cookie("uid", String.valueOf(userId));
        c.setPath("/");
        c.setHttpOnly(false); // NOTE: For exercise only. In prod, use HttpOnly + Secure + SameSite.
        c.setMaxAge(60 * 60 * 24 * 30); // 30 days
        response.addCookie(c);
    }
}
