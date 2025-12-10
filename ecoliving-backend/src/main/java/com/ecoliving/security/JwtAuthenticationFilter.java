package com.ecoliving.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();
        
        System.out.println("\n🔍 JwtAuthenticationFilter - Iniciando");
        System.out.println("   📍 Path: " + path);
        System.out.println("   🚀 Method: " + method);
        System.out.println("   🌐 Origin: " + request.getHeader("Origin"));

        // ==============================================
        // 1. PRIMERO: Verificar si es petición DEMO
        // ==============================================
        String demoMode = request.getHeader("X-Demo-Mode");
        String demoUser = request.getHeader("X-Demo-User");
        
        System.out.println("   🎭 X-Demo-Mode: " + demoMode);
        System.out.println("   👤 X-Demo-User: " + demoUser);
        
        if ("true".equals(demoMode) && demoUser != null) {
            System.out.println("✅ MODO DEMO DETECTADO para usuario: " + demoUser);
            
            // Determinar el rol basado en el usuario demo
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            
            if ("admin@ecoliving.com".equals(demoUser)) {
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                System.out.println("   👑 Rol asignado: ADMIN + USER");
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                System.out.println("   👤 Rol asignado: USER");
            }
            
            // Crear token de autenticación
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                demoUser,          // principal
                null,              // credentials (sin contraseña en demo)
                authorities        // roles/authorities
            );
            
            // Añadir detalles adicionales
            Map<String, Object> details = new HashMap<>();
            details.put("demo", true);
            details.put("userId", 999999);
            details.put("email", demoUser);
            details.put("name", demoUser.equals("admin@ecoliving.com") ? 
                "Administrador Demo ECOLIVING" : "Usuario Demo");
            authToken.setDetails(details);
            
            // Establecer en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authToken);
            
            System.out.println("✅ Autenticación DEMO establecida exitosamente");
            System.out.println("   📍 Path: " + path + " será procesado con autenticación demo");
            
            // Continuar con la cadena de filtros
            chain.doFilter(request, response);
            return;
        }

        // ==============================================
        // 2. SEGUNDO: Si no es DEMO, procesar JWT normal
        // ==============================================
        final String authHeader = request.getHeader("Authorization");
        System.out.println("   🔐 Authorization header: " + 
            (authHeader != null ? authHeader.substring(0, Math.min(authHeader.length(), 50)) + "..." : "null"));
        
        String email = null;
        String role = null;

        // Verificar si hay token JWT
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
                role = jwtUtil.extractRole(token);
                System.out.println("✅ JWT válido detectado");
                System.out.println("   📧 Email: " + email);
                System.out.println("   🎯 Rol: " + role);
            } catch (Exception e) {
                System.out.println("⚠️ JWT inválido o error al procesar: " + e.getMessage());
                // Continuar sin autenticación
            }
        } else {
            System.out.println("ℹ️ No hay token JWT, continuando sin autenticación");
        }

        // Si hay email y no hay autenticación en el contexto
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(authHeader.substring(7), email)) {
                    // Crear lista de autoridades basada en el rol
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    if (role != null) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
                    } else {
                        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    }
                    
                    // Crear token de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities
                    );
                    
                    // Añadir detalles de la solicitud
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Establecer en el contexto
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    System.out.println("✅ Autenticación JWT establecida exitosamente para: " + email);
                } else {
                    System.out.println("❌ Validación de JWT falló para: " + email);
                }
            } catch (Exception e) {
                System.out.println("❌ Error validando token JWT: " + e.getMessage());
                // No establecer autenticación si el token es inválido
            }
        }

        // ==============================================
        // 3. CONTINUAR con la cadena de filtros
        // ==============================================
        System.out.println("➡️ Continuando con la cadena de filtros...\n");
        chain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Definir paths que no necesitan pasar por este filtro
        String path = request.getServletPath();
        
        // Los paths públicos no necesitan autenticación
        boolean isPublicPath = path.startsWith("/api/auth/") || 
                               path.startsWith("/api/products") ||
                               path.startsWith("/api/categories") ||
                               path.equals("/error") ||
                               path.startsWith("/actuator/");
        
        if (isPublicPath) {
            System.out.println("⏭️  Saltando filtro para path público: " + path);
        }
        
        return isPublicPath;
    }
}