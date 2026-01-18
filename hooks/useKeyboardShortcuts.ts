import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description: string;
}

export const useKeyboardShortcuts = () => {
    const router = useRouter();

    const shortcuts: ShortcutConfig[] = [
        {
            key: 'n',
            ctrl: true,
            action: () => router.push('/dashboard/invoices/new'),
            description: 'New Invoice',
        },
        {
            key: 'c',
            ctrl: true,
            shift: true,
            action: () => router.push('/dashboard/clients/new'),
            description: 'New Client',
        },
        {
            key: 'e',
            ctrl: true,
            shift: true,
            action: () => router.push('/dashboard/expenses/new'),
            description: 'New Expense',
        },
        {
            key: 'd',
            ctrl: true,
            shift: true,
            action: () => router.push('/dashboard'),
            description: 'Go to Dashboard',
        },
        {
            key: 'r',
            ctrl: true,
            shift: true,
            action: () => router.push('/dashboard/reports'),
            description: 'View Reports',
        },
    ];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            const matchedShortcut = shortcuts.find(shortcut => {
                const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
                const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
                const altMatches = shortcut.alt ? event.altKey : !event.altKey;

                return keyMatches && ctrlMatches && shiftMatches && altMatches;
            });

            if (matchedShortcut) {
                event.preventDefault();
                matchedShortcut.action();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return { shortcuts };
};

// Helper to format shortcut display
export const formatShortcut = (shortcut: ShortcutConfig): string => {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
};
