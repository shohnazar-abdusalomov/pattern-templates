package com.pattern.builder.http;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * 1-HOLAT: REST API / HTTP So'rov Builder (Joshua Bloch - Effective Java uslubi).
 * 
 * Xususiyatlari:
 * - Butunlay Immutable (o'zgarmas holat) va Thread-Safe.
 * - Kolleksiyalar (headers, queryParams) himoyalangan (Collections.unmodifiableMap).
 * - Fluent chaining API (.header(), .queryParam(), .bearerToken()).
 * - build() chaqirilganda URL formati, HTTP metodlar va parametrlarni qat'iy tekshiradi.
 */
public final class HttpRequest {

    private final String url;
    private final HttpMethod method;
    private final Map<String, String> headers;
    private final Map<String, String> queryParams;
    private final String body;
    private final int timeoutMillis;
    private final boolean followRedirects;

    // Private konstruktor - obyekt faqat Builder orqali yasaladi
    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = Collections.unmodifiableMap(new HashMap<>(builder.headers));
        this.queryParams = Collections.unmodifiableMap(new HashMap<>(builder.queryParams));
        this.body = builder.body;
        this.timeoutMillis = builder.timeoutMillis;
        this.followRedirects = builder.followRedirects;
    }

    public String getUrl() { return url; }
    public HttpMethod getMethod() { return method; }
    public Map<String, String> getHeaders() { return headers; }
    public Map<String, String> getQueryParams() { return queryParams; }
    public String getBody() { return body; }
    public int getTimeoutMillis() { return timeoutMillis; }
    public boolean isFollowRedirects() { return followRedirects; }

    /**
     * Yig'ilgan to'liq URL manzilini (query parametrlari bilan) qaytaradi.
     */
    public String getFullUrl() {
        if (queryParams.isEmpty()) {
            return url;
        }
        StringBuilder sb = new StringBuilder(url);
        sb.append(url.contains("?") ? "&" : "?");
        int count = 0;
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            if (count++ > 0) sb.append("&");
            sb.append(entry.getKey()).append("=").append(entry.getValue());
        }
        return sb.toString();
    }

    @Override
    public String toString() {
        return "HttpRequest {\n" +
                "  Method: " + method + "\n" +
                "  URL: " + getFullUrl() + "\n" +
                "  Headers: " + headers + "\n" +
                "  Timeout: " + timeoutMillis + "ms\n" +
                "  FollowRedirects: " + followRedirects + "\n" +
                "  Body: " + (body == null ? "(none)" : body) + "\n" +
                "}";
    }

    // Builder yaratish uchun yordamchi statik metodlar
    public static Builder get(String url) {
        return new Builder(url, HttpMethod.GET);
    }

    public static Builder post(String url) {
        return new Builder(url, HttpMethod.POST);
    }

    public static Builder builder(String url, HttpMethod method) {
        return new Builder(url, method);
    }

    /**
     * Statik ichki Builder klassi
     */
    public static class Builder {
        private final String url;
        private final HttpMethod method;
        private final Map<String, String> headers = new HashMap<>();
        private final Map<String, String> queryParams = new HashMap<>();
        private String body;
        private int timeoutMillis = 5000; // Standart: 5 soniya
        private boolean followRedirects = true;

        public Builder(String url, HttpMethod method) {
            this.url = Objects.requireNonNull(url, "URL manzili bo'sh bo'lishi mumkin emas!");
            this.method = Objects.requireNonNull(method, "HTTP metod ko'rsatilishi shart!");
        }

        public Builder header(String key, String value) {
            if (key != null && value != null) {
                this.headers.put(key, value);
            }
            return this;
        }

        public Builder bearerToken(String token) {
            return header("Authorization", "Bearer " + Objects.requireNonNull(token, "Token null bo'lishi mumkin emas!"));
        }

        public Builder contentTypeJson() {
            return header("Content-Type", "application/json");
        }

        public Builder queryParam(String key, String value) {
            if (key != null && value != null) {
                this.queryParams.put(key, value);
            }
            return this;
        }

        public Builder body(String body) {
            this.body = body;
            return this;
        }

        public Builder timeoutMillis(int timeoutMillis) {
            this.timeoutMillis = timeoutMillis;
            return this;
        }

        public Builder followRedirects(boolean followRedirects) {
            this.followRedirects = followRedirects;
            return this;
        }

        /**
         * build() metodi: barcha invariantlarni tekshiradi
         */
        public HttpRequest build() {
            // Validatsiya: URL protokoli tekshiruvi
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                throw new IllegalArgumentException("Noto'g'ri URL protokoli! URL http:// yoki https:// bilan boshlanishi kerak: " + url);
            }

            // Validatsiya: Timeout musbat bo'lishi kerak
            if (timeoutMillis < 0) {
                throw new IllegalStateException("Timeout manfiy bo'lishi mumkin emas: " + timeoutMillis);
            }

            // Validatsiya: GET so'rovida odatda body bo'lmasligi kerak
            if (method == HttpMethod.GET && body != null && !body.isBlank()) {
                throw new IllegalStateException("GET so'rovida request body yuborish tavsiya etilmaydi!");
            }

            // Standart header qo'shish
            headers.putIfAbsent("User-Agent", "Custom-Java-Client/1.0");

            return new HttpRequest(this);
        }
    }
}
