'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { teamInvitationsApi } from '@/lib/api/teamInvitationsApi';
import toast from 'react-hot-toast';

export default function AcceptInvitationContent() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            acceptInvitation();
        }
    }, [token]);

    const acceptInvitation = async () => {
        try {
            await teamInvitationsApi.acceptInvitation(token);
            toast.success('Invitation accepted! Welcome to the team!');
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to accept invitation');
            setIsProcessing(false);
        }
    };

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Accepting invitation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Invitation Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={() => router.push('/login')} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
