package com.example.PizzaClub.service;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class HorarioService {

    // Crítico: Zona horaria obligatoria para asegurar que el despliegue en UTC funcione correctamente.
    private static final ZoneId ZONE_ID = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final LocalTime HORA_APERTURA = LocalTime.of(10, 0);
    private static final LocalTime HORA_CIERRE = LocalTime.of(23, 0);

    public boolean isAbierto() {
        ZonedDateTime ahora = ZonedDateTime.now(ZONE_ID);
        DayOfWeek diaSemana = ahora.getDayOfWeek();

        // Regla: Martes cerrado
        if (diaSemana == DayOfWeek.TUESDAY) {
            return false;
        }

        LocalTime horaActual = ahora.toLocalTime();
        
        // Regla: Abierto de 10:00 a 23:00
        return !horaActual.isBefore(HORA_APERTURA) && !horaActual.isAfter(HORA_CIERRE);
    }
}