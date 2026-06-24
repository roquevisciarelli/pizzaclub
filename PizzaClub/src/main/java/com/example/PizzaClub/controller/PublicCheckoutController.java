package com.example.PizzaClub.controller;

import com.example.PizzaClub.dto.HorarioResponseDTO;
import com.example.PizzaClub.dto.PedidoRequestDTO;
import com.example.PizzaClub.service.HorarioService;
import com.example.PizzaClub.service.MercadoPagoService;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/checkout")
@RequiredArgsConstructor
public class PublicCheckoutController {

    private final HorarioService horarioService;
    private final MercadoPagoService mercadoPagoService;

    @GetMapping("/validar-horario")
    public ResponseEntity<HorarioResponseDTO> validarHorario() {
        boolean abierto = horarioService.isAbierto();
        String mensaje = abierto 
                ? "El local se encuentra abierto." 
                : "El local se encuentra cerrado. Nuestro horario de atención es de Miércoles a Lunes de 10:00 a 23:00 (Martes cerrado).";
        
        return ResponseEntity.ok(HorarioResponseDTO.builder()
                .abierto(abierto)
                .mensaje(mensaje)
                .build());
    }

    @PostMapping("/crear-preferencia")
    public ResponseEntity<?> crearPreferenciaPago(@RequestBody PedidoRequestDTO pedido) {
        // Validación estricta de horario
        if (!horarioService.isAbierto()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El local se encuentra cerrado en este momento. No se pueden procesar pedidos.");
        }

        try {
            String preferenceId = mercadoPagoService.crearPreferencia(pedido);
            
            Map<String, String> response = new HashMap<>();
            response.put("preferenceId", preferenceId);
            
            return ResponseEntity.ok(response);
            
        } catch (MPException | MPApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al comunicarse con Mercado Pago: " + e.getMessage());
        }
    }
}