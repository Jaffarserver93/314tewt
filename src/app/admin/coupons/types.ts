
export interface Coupon {
    id: string;
    code: string;
    discount_percentage: number;
    max_uses: number;
    usage_count: number;
    created_at: string;
    expires_at: string | null;
    is_active: boolean;
}

export interface Redemption {
    id: string;
    created_at: string;
    users: {
        id: string;
        username: string;
        email: string;
        avatar_url: string;
    };
}

export interface CouponWithRedemptions extends Coupon {
    redemptions: Redemption[];
}
