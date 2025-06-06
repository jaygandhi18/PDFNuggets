import { getPriceIdForActiveUser } from '@/lib/user';
import { pricingPlans } from '@/utils/constants';
import { currentUser } from '@clerk/nextjs/server';
import { Badge } from '../ui/badge';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = "force-dynamic";

export default async function PlanBadge() {
    const user = await currentUser();

    if (!user?.id) return null;

    // const email = user?.emailAddresses?.[0]?.emailAddress;

    let priceId: string | null = null;

    if (user.id) {
    priceId = await getPriceIdForActiveUser(user.id);
}

    let planName = 'Buy a plan';

    const plan = pricingPlans.find((plan) => plan.priceId === priceId);

    if (plan) {
        console.log(planName);
        planName = plan.name;
    }

    return (
        <Badge
            variant="outline"
            className={cn(
                'ml-2 bg-linear-to-r from-emerald-100 to-cyan-200 border-teal-300 hidden lg:flex flex-row items-center',
                !priceId && 'from-gray-100 to-gray-200 border-gray-300'
            )}
        >
            <Crown
                className={cn(
                    'w-3 h-3 mr-1 text-teal-600',
                    !priceId && 'text-gray-600'
                )}
            />
            {planName}
        </Badge>
    );
}
