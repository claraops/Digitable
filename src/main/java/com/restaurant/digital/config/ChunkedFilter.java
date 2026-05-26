package com.restaurant.digital.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class ChunkedFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 🛠️ Si la requête demande une image, on passe le filtre sans forcer le JSON !
        if (httpRequest.getRequestURI().contains("/api/v1/images")) {
            chain.doFilter(request, response);
            return;
        }

        httpResponse.setHeader("Transfer-Encoding", "identity");
        httpResponse.setHeader("Content-Type", "application/json;charset=UTF-8");
        chain.doFilter(request, response);
    }
}