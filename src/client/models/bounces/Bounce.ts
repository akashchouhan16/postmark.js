export interface Bounce {
    RecordType: string
    ID: number
    Type: string
    TypeCode: number
    Name: string
    Tag?: string
    MessageID: string
    ServerID: string
    Description: string
    Details: string
    Email: string
    From: string
    BouncedAt:  string
    DumpAvailable: boolean
    Inactive: boolean
    CanActivate: boolean
    Subject: string
    Content?: string
}

export interface BounceDump {
    Body: string
}

export interface BounceActivateResponse {
    Message: string
    Bounce: Bounce
}

export interface Bounces {
    TotalCount: number
    Bounces: Bounce[]
}

export interface BounceMetric {
    Name: string
    Count: number
    Type?: string
}

export interface DeliveryStatistics {
    InactiveMails: number
    Bounces: BounceMetric[]
}