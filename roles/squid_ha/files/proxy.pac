function FindProxyForURL(url, host) {
    // 1. Исключения для локальных имен (без точек, например http://intranet)
    if (isPlainHostName(host)) {
        return "DIRECT";
    }

    // 2. Исключения для внутренних доменов (замените на свои при необходимости)
    if (shExpMatch(host, "*.enbek.kz") ||
        shExpMatch(host, "*.crtr.local")) {
        return "DIRECT";
    }

    // 3. Исключения для локальных IP-сетей (чтобы локальный трафик не шел через прокси)
    var resolved_ip = dnsResolve(host);
    if (isInNet(resolved_ip, "10.0.0.0", "255.0.0.0") ||
        isInNet(resolved_ip, "172.16.0.0", "255.240.0.0") ||
        isInNet(resolved_ip, "192.168.0.0", "255.255.0.0") ||
        isInNet(resolved_ip, "127.0.0.0", "255.255.255.0")) {
        return "DIRECT";
    }

    // 4. Весь остальной трафик направляем на VIP-адрес прокси-кластера
    // ВАЖНО: Должно строго совпадать с SPN в Keytab (например, proxy01.enbek.kz)
    return "PROXY proxy01.enbek.kz:3128; DIRECT";
}
