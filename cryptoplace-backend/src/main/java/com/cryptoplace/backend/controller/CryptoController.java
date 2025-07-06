package com.cryptoplace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/crypto")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Cryptocurrency", description = "Cryptocurrency data API")
public class CryptoController {

    @Value("${coingecko.api.url}")
    private String coinGeckoApiUrl;

    @Value("${coingecko.api.key}")
    private String coinGeckoApiKey;

    private final WebClient webClient;

    public CryptoController() {
        this.webClient = WebClient.builder().build();
    }

    @GetMapping("/coins")
    @Operation(summary = "Get cryptocurrency list", description = "Retrieve list of cryptocurrencies with market data")
    public Mono<ResponseEntity<Object>> getCryptocurrencies(
            @RequestParam(defaultValue = "usd") String vsCurrency,
            @RequestParam(defaultValue = "100") int perPage,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "market_cap_desc") String order) {

        String url = String.format("%s/coins/markets?vs_currency=%s&order=%s&per_page=%d&page=%d&sparkline=false&x_cg_demo_api_key=%s",
                coinGeckoApiUrl, vsCurrency, order, perPage, page, coinGeckoApiKey);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(500).body(createErrorResponse("Failed to fetch cryptocurrency data")));
    }

    @GetMapping("/coin/{id}")
    @Operation(summary = "Get coin details", description = "Retrieve detailed information about a specific cryptocurrency")
    public Mono<ResponseEntity<Object>> getCoinDetails(@PathVariable String id) {
        String url = String.format("%s/coins/%s?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=%s",
                coinGeckoApiUrl, id, coinGeckoApiKey);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(404).body(createErrorResponse("Cryptocurrency not found")));
    }

    @GetMapping("/coin/{id}/history")
    @Operation(summary = "Get coin price history", description = "Retrieve historical price data for a cryptocurrency")
    public Mono<ResponseEntity<Object>> getCoinHistory(
            @PathVariable String id,
            @RequestParam(defaultValue = "usd") String vsCurrency,
            @RequestParam(defaultValue = "30") int days,
            @RequestParam(defaultValue = "daily") String interval) {

        String url = String.format("%s/coins/%s/market_chart?vs_currency=%s&days=%d&interval=%s&x_cg_demo_api_key=%s",
                coinGeckoApiUrl, id, vsCurrency, days, interval, coinGeckoApiKey);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(500).body(createErrorResponse("Failed to fetch price history")));
    }

    @GetMapping("/prices")
    @Operation(summary = "Get current prices", description = "Get current prices for multiple cryptocurrencies")
    public Mono<ResponseEntity<Object>> getCurrentPrices(
            @RequestParam String ids,
            @RequestParam(defaultValue = "usd") String vsCurrencies,
            @RequestParam(defaultValue = "false") boolean includeMarketCap,
            @RequestParam(defaultValue = "false") boolean include24hrVol,
            @RequestParam(defaultValue = "false") boolean include24hrChange) {

        StringBuilder urlBuilder = new StringBuilder(String.format("%s/simple/price?ids=%s&vs_currencies=%s", 
                coinGeckoApiUrl, ids, vsCurrencies));

        if (includeMarketCap) {
            urlBuilder.append("&include_market_cap=true");
        }
        if (include24hrVol) {
            urlBuilder.append("&include_24hr_vol=true");
        }
        if (include24hrChange) {
            urlBuilder.append("&include_24hr_change=true");
        }
        urlBuilder.append("&x_cg_demo_api_key=").append(coinGeckoApiKey);

        return webClient.get()
                .uri(urlBuilder.toString())
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(500).body(createErrorResponse("Failed to fetch current prices")));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending coins", description = "Get trending cryptocurrencies")
    public Mono<ResponseEntity<Object>> getTrendingCoins() {
        String url = String.format("%s/search/trending?x_cg_demo_api_key=%s", coinGeckoApiUrl, coinGeckoApiKey);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(500).body(createErrorResponse("Failed to fetch trending coins")));
    }

    @GetMapping("/global")
    @Operation(summary = "Get global market data", description = "Get global cryptocurrency market data")
    public Mono<ResponseEntity<Object>> getGlobalMarketData() {
        String url = String.format("%s/global?x_cg_demo_api_key=%s", coinGeckoApiUrl, coinGeckoApiKey);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(500).body(createErrorResponse("Failed to fetch global market data")));
    }

    @GetMapping("/exchanges")
    @Operation(summary = "Get exchanges list", description = "Get list of cryptocurrency exchanges")
    public Mono<ResponseEntity<Object>> getExchanges(@RequestParam(defaultValue = "50") int perPage) {
        String url = String.format("%s/exchanges?per_page=%d&x_cg_demo_api_key=%s", 
                coinGeckoApiUrl, perPage, coinGeckoApiKey);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(500).body(createErrorResponse("Failed to fetch exchanges data")));
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        error.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return error;
    }
} 