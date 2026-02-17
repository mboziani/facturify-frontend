'use client';
import Image from 'next/image';

import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { teamInvitationsApi, TeamInvitation } from '@/lib/api/teamInvitationsApi';
import { companyApi } from '@/lib/api/company';
import { CompanyMember } from '@/types/company';
import toast from 'react-hot-toast';

export default function TeamSettingsPage() {
    const { currentCompany } = useCompany();
    const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
    const [members, setMembers] = useState<CompanyMember[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
    const [isLoading, setIsLoading] = useState(false);

    const loadInvitations = useCallback(async () => {
        if (!currentCompany) return;
        try {
            const data = await teamInvitationsApi.getInvitations(currentCompany.id);
            setInvitations(data);
        } catch (error) {
            console.error('Failed to load invitations:', error);
        }
    }, [currentCompany]);

    const loadMembers = useCallback(async () => {
        if (!currentCompany) return;
        try {
            const data = await companyApi.getMembers(currentCompany.id);
            setMembers(data);
        } catch (error) {
            console.error('Failed to load members:', error);
        }
    }, [currentCompany]);

    useEffect(() => {
        if (currentCompany) {
            loadInvitations();
            loadMembers();
        }
    }, [currentCompany, loadInvitations, loadMembers]);

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCompany) return;

        setIsLoading(true);
        try {
            await teamInvitationsApi.sendInvitation({
                companyId: currentCompany.id,
                email: inviteEmail,
                role: inviteRole,
            });
            toast.success('Invitation sent!');
            setInviteEmail('');
            setShowInviteModal(false);
            loadInvitations();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelInvite = async (id: string) => {
        if (!confirm('Cancel this invitation?')) return;

        try {
            await teamInvitationsApi.cancelInvitation(id);
            toast.success('Invitation cancelled');
            loadInvitations();
        } catch (error) {
            toast.error('Failed to cancel invitation');
        }
    };

    const handleResendInvite = async (id: string) => {
        try {
            await teamInvitationsApi.resendInvitation(id);
            toast.success('Invitation resent!');
            loadInvitations();
        } catch (error) {
            toast.error('Failed to resend invitation');
        }
    };

    return (
        <div className="p-6 sm:p-8">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Team Members</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage team access and invitations
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Invite Member
                </button>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-lg border border-slate-200 mb-8 p-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Active Members</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            {member.user.avatarUrl ? (
                                                <Image src={member.user.avatarUrl} alt="" width={32} height={32} className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                    {member.user.firstName[0]}
                                                </div>
                                            )}
                                            {member.user.firstName} {member.user.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {member.user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {member.role || 'Member'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pending Invitations */}
            {invitations.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Pending Invitations</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sent By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expires</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {invitations.map((invitation) => (
                                    <tr key={invitation.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                            {invitation.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {invitation.role}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {invitation.inviter?.firstName} {invitation.inviter?.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(invitation.expiresAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => handleResendInvite(invitation.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Resend
                                            </button>
                                            <button
                                                onClick={() => handleCancelInvite(invitation.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Invite Team Member</h3>
                        <p className="text-slate-500 text-sm mb-6">Send an email invitation to join your team.</p>

                        <form onSubmit={handleSendInvite}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="colleague@example.com"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Role
                                </label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as 'MEMBER' | 'ADMIN')}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="MEMBER">Member</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <p className="mt-2 text-xs text-slate-500">
                                    {inviteRole === 'ADMIN'
                                        ? 'Admins can manage settings, team members, and all data.'
                                        : 'Members can create invoices and view data.'}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
