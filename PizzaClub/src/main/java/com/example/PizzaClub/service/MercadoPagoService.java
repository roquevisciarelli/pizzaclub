package com.example.PizzaClub.service;

import com.example.PizzaClub.dto.PedidoItemDTO;
import com.example.PizzaClub.dto.PedidoRequestDTO;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    private static final Logger log = LoggerFactory.getLogger(MercadoPagoService.class);

    @Value("${mercadopago.access_token}")
    private String accessToken;

    @Value("${frontend.url}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String crearPreferencia(PedidoRequestDTO pedidoRequest) throws MPException, MPApiException {
        List<PreferenceItemRequest> items = new ArrayList<>();

        for (PedidoItemDTO itemDto : pedidoRequest.getItems()) {
            log.debug("Item: title={}, quantity={}, unitPrice={}", itemDto.getTitulo(), itemDto.getCantidad(), itemDto.getPrecioUnitario());
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(itemDto.getTitulo())
                    .quantity(itemDto.getCantidad())
                    .unitPrice(BigDecimal.valueOf(itemDto.getPrecioUnitario()))
                    .currencyId("ARS")
                    .build();
            items.add(itemRequest);
        }

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(frontendUrl + "/success")
                .pending(frontendUrl + "/pending")
                .failure(frontendUrl + "/failure")
                .build();

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                .autoReturn("approved")
                .build();

        PreferenceClient client = new PreferenceClient();

        try {
            Preference preference = client.create(preferenceRequest);
            return preference.getId();
        } catch (MPApiException e) {
            log.error("MercadoPago API error — status={}, message={}, response={}",
                    e.getStatusCode(), e.getMessage(), e.getApiResponse().getContent());
            throw e;
        }
    }
}