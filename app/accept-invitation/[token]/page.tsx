import AcceptInvitationContent from './AcceptInvitationContent';

// Required for static export
export function generateStaticParams() {
    return [{ token: 'demo-token' }];
}

export default function AcceptInvitationPage() {
    return <AcceptInvitationContent />;
}
