'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { projectApi } from '@/lib/api/projectApi';
import { timeApi } from '@/lib/api/timeApi';
import { Project } from '@/types/project';
import { PlayIcon, StopIcon, ClockIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

export default function TimeTracker() {
    const { currentCompany } = useCompany();
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeEntry, setActiveEntry] = useState<{
        startTime: number;
        projectId: string;
        description: string;
    } | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Form states
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [description, setDescription] = useState('');

    const loadProjects = useCallback(async () => {
        if (!currentCompany) return;
        try {
            const data = await projectApi.getProjects(currentCompany.id, { status: 'IN_PROGRESS' });
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load projects', err);
        }
    }, [currentCompany]);

    useEffect(() => {
        if (currentCompany) {
            loadProjects();
            // Check local storage for running timer
            const savedTimer = localStorage.getItem(`active_timer_${currentCompany.id}`);
            if (savedTimer) {
                const data = JSON.parse(savedTimer);
                setActiveEntry(data);
                setSelectedProjectId(data.projectId);
                setDescription(data.description);
                const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
                setElapsedTime(elapsed);
            }
        }
    }, [currentCompany, loadProjects]);

    useEffect(() => {
        if (activeEntry) {
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setElapsedTime(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeEntry]);

    const startTimer = () => {
        if (!selectedProjectId) {
            toast.error('Please select a project first');
            return;
        }
        const newEntry = {
            startTime: Date.now(),
            projectId: selectedProjectId,
            description: description
        };
        setActiveEntry(newEntry);
        localStorage.setItem(`active_timer_${currentCompany!.id}`, JSON.stringify(newEntry));
    };

    const stopTimer = async () => {
        if (!activeEntry || !currentCompany) return;

        setIsSubmitting(true);
        try {
            const endTime = Date.now();
            const durationMinutes = Math.max(1, Math.round((endTime - activeEntry.startTime) / 60000));
            const project = projects.find(p => p.id === activeEntry.projectId);

            await timeApi.createTimeEntry({
                companyId: currentCompany.id,
                projectId: activeEntry.projectId,
                clientId: project?.clientId || '',
                description: description || 'No description',
                startTime: new Date(activeEntry.startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                duration: durationMinutes,
                billable: true,
                status: 'PENDING'
            });

            toast.success('Time entry saved!');
            setActiveEntry(null);
            setDescription('');
            localStorage.removeItem(`active_timer_${currentCompany.id}`);
        } catch (err) {
            console.error('Failed to save time entry', err);
            toast.error('Failed to save time entry');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                    <input
                        type="text"
                        placeholder="What are you working on?"
                        className="w-full border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={!!activeEntry}
                    />
                </div>

                <div className="w-full md:w-64">
                    <select
                        className="w-full border-slate-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        disabled={!!activeEntry}
                    >
                        <option value="">Select Project</option>
                        {Array.isArray(projects) && projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-2xl font-mono font-bold text-slate-700 w-24 tabular-nums">
                        {formatTime(elapsedTime)}
                    </div>

                    {!activeEntry ? (
                        <button
                            onClick={startTimer}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg shadow-indigo-100 transition-all transform hover:scale-105 active:scale-95"
                            title="Start Tracking"
                        >
                            <PlayIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <button
                            onClick={stopTimer}
                            disabled={isSubmitting}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg shadow-red-100 transition-all transform hover:scale-105 active:scale-95"
                            title="Stop Tracking"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <StopIcon className="w-6 h-6" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
