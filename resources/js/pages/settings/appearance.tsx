import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/ui/core/layout/settings/fragments/appearance-tabs';
import HeadingSmall from '@/components/ui/core/layout/app/fragments/heading-small';

import AppLayout from '@/components/ui/core/layout/app/app-layout';
import SettingsLayout from '@/components/ui/core/layout/settings/layout';

export default function Appearance() {
    return (
        <AppLayout >
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
