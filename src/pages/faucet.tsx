import React from 'react';
import DashboardLayout from '@/layouts/Dashboard';
import FaucetView from '@/views/Faucet';

export default function FaucetPage() {
    return (
        <DashboardLayout>
            <FaucetView />
        </DashboardLayout>
    );
}