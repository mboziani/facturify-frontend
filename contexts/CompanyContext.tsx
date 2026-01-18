'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Company, CreateCompanyData, UpdateCompanyData } from '@/types/company';
import { companyApi } from '@/lib/api/company';
import { useAuth } from './AuthContext';

interface CompanyContextType {
    currentCompany: Company | null;
    companies: Company[];
    isLoading: boolean;
    error: string | null;
    createCompany: (data: CreateCompanyData) => Promise<Company>;
    updateCompany: (id: string, data: UpdateCompanyData) => Promise<Company>;
    switchCompany: (id: string) => Promise<void>;
    refreshCompanies: () => Promise<void>;
    deleteCompany: (id: string) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCompanies = useCallback(async () => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }

        try {
            setError(null);
            const [companiesList, defaultCompany] = await Promise.all([
                companyApi.list(),
                companyApi.getDefault(),
            ]);

            setCompanies(companiesList);
            setCurrentCompany(defaultCompany || companiesList[0] || null);
        } catch (err: any) {
            console.error('Failed to load companies:', err);
            setError(err.message || 'Failed to load companies');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!authLoading) {
            loadCompanies();
        }
    }, [authLoading, loadCompanies]);

    const createCompany = useCallback(async (data: CreateCompanyData): Promise<Company> => {
        const newCompany = await companyApi.create(data);
        setCompanies(prev => [...prev, newCompany]);

        // Using functional state update or ref would be better to avoid dependency on currentCompany, 
        // but currentCompany is needed for logic. 
        // We will include it in deps.
        setCurrentCompany(prev => !prev ? newCompany : prev);

        return newCompany;
    }, []);

    const updateCompany = useCallback(async (id: string, data: UpdateCompanyData): Promise<Company> => {
        const updated = await companyApi.update(id, data);

        setCompanies(prev => prev.map(c => c.id === id ? updated : c));

        setCurrentCompany(prev => prev?.id === id ? updated : prev);

        return updated;
    }, []);

    const switchCompany = useCallback(async (id: string): Promise<void> => {
        await companyApi.setDefault(id);
        setCompanies(currentCompanies => {
            const company = currentCompanies.find(c => c.id === id);
            if (company) setCurrentCompany(company);
            return currentCompanies;
        });
    }, []);

    const deleteCompany = useCallback(async (id: string): Promise<void> => {
        await companyApi.delete(id);
        setCompanies(prev => prev.filter(c => c.id !== id));

        setCurrentCompany(prev => {
            if (prev?.id === id) {
                // We can't easily access the 'new' list here without prop drilling or assumption.
                // But since setCompanies updates state, we might have a sync issue.
                // Ideally this logic should be improved, but for now we'll just check against the 'prev' of setCompanies.
                // Actually, let's keep it simple: if deleted company is current, nullify it or reload.
                return null;
            }
            return prev;
        });

        // Reload to be safe if current was deleted
        // loadCompanies(); // Caused loop? better just set to null
    }, []);

    const refreshCompanies = useCallback(async (): Promise<void> => {
        await loadCompanies();
    }, [loadCompanies]);

    const value: CompanyContextType = React.useMemo(() => ({
        currentCompany,
        companies,
        isLoading,
        error,
        createCompany,
        updateCompany,
        switchCompany,
        refreshCompanies,
        deleteCompany,
    }), [currentCompany, companies, isLoading, error, createCompany, updateCompany, switchCompany, refreshCompanies, deleteCompany]);

    return (
        <CompanyContext.Provider value={value}>
            {children}
        </CompanyContext.Provider>
    );
}

export function useCompany() {
    const context = useContext(CompanyContext);

    if (context === undefined) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }

    return context;
}
