'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, CreateTaskData } from '@/types/task';
import { taskApi } from '@/lib/api/taskApi';
import { PlusIcon, EllipsisHorizontalIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ProjectTasksProps {
    projectId: string;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'TODO', label: 'To Do', color: 'bg-slate-50 border-slate-200' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'DONE', label: 'Done', color: 'bg-emerald-50 border-emerald-200' },
];

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState<TaskStatus | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const loadTasks = useCallback(async () => {
        try {
            const data = await taskApi.getTasksByProject(projectId);
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load tasks', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleCreateTask = async (status: TaskStatus) => {
        if (!newTaskTitle.trim()) return;
        try {
            const newTask = await taskApi.createTask({
                projectId,
                title: newTaskTitle,
                status,
                priority: 'MEDIUM',
            });
            setTasks([...tasks, newTask]);
            setNewTaskTitle('');
            setIsCreating(null);
        } catch (err) {
            console.error('Failed to create task', err);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await taskApi.deleteTask(taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
        try {
            // Optimistic update
            const updatedTasks = tasks.map(t =>
                t.id === taskId ? { ...t, status: newStatus } : t
            );
            setTasks(updatedTasks);
            await taskApi.updateTask(taskId, { status: newStatus });
        } catch (err) {
            console.error('Failed to update task status', err);
            loadTasks(); // Revert on error
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4 min-h-[500px]">
            {COLUMNS.map((col) => (
                <div key={col.id} className="flex-1 min-w-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            {col.label}
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </h3>
                        <button
                            onClick={() => setIsCreating(col.id)}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className={`flex-1 rounded-xl border p-3 space-y-3 ${col.color}`}>
                        {/* Create Form */}
                        {isCreating === col.id && (
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-200">
                                <textarea
                                    autoFocus
                                    placeholder="Task title..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleCreateTask(col.id);
                                        }
                                        if (e.key === 'Escape') setIsCreating(null);
                                    }}
                                    className="w-full text-sm border-none focus:ring-0 resize-none p-0 mb-2 font-medium"
                                    rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsCreating(null)}
                                        className="text-xs text-slate-500 hover:text-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleCreateTask(col.id)}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Task List */}
                        {tasks
                            .filter(task => task.status === col.id)
                            .map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group hover:border-indigo-300 transition-colors cursor-move">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-medium text-slate-800 leading-tight">
                                            {task.title}
                                        </p>
                                        <div className="relative group/menu">
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <EllipsisHorizontalIcon className="w-5 h-5" />
                                            </button>
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 hidden group-hover/menu:block z-10">
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                                        <span className={`px-2 py-0.5 rounded font-medium 
                                            ${task.priority === 'HIGH' ? 'bg-red-50 text-red-700' :
                                                task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'}`}>
                                            {task.priority || 'NORMAL'}
                                        </span>

                                        {/* Simple Status Mover for non-DnD */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {col.id !== 'TODO' && (
                                                <button
                                                    onClick={() => handleMoveTask(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
                                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"
                                                    title="Move Left"
                                                >
                                                    ←
                                                </button>
                                            )}
                                            {col.id !== 'DONE' && (
                                                <button
                                                    onClick={() => handleMoveTask(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"
                                                    title="Move Right"
                                                >
                                                    →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {tasks.filter(task => task.status === col.id).length === 0 && !isCreating && (
                            <div className="text-center py-8 text-slate-400 text-sm italic">
                                No tasks
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
