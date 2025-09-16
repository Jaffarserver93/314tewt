import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getCoupons } from './actions';
import CouponsClientPage from './coupons-client-page';
import type { CouponWithRedemptions } from './types';


export default async function CouponsAdminPage() {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;

    if (!userRole || !['super admin', 'admin', 'manager'].includes(userRole)) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const coupons: CouponWithRedemptions[] = await getCoupons();

    return <CouponsClientPage initialCoupons={coupons} />;
}
