using System;

public record PushSubscriptionDto(
    string Endpoint,
    string P256dh,
    string Auth);
