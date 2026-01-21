import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

// Mock data storage
let tasks: Task[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const taskApi = {
    async getTasksByProject(projectId: string): Promise<Task[]> {
        await delay(500);
        return tasks.filter(t => t.projectId === projectId);
    },

    async createTask(data: CreateTaskData): Promise<Task> {
        await delay(500);
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            status: data.status || 'TODO',
            priority: data.priority || 'MEDIUM',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        return newTask;
    },

    async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
        await delay(500);
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Task not found');

        tasks[index] = {
            ...tasks[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        return tasks[index];
    },

    async deleteTask(id: string): Promise<void> {
        await delay(500);
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Task not found');
        tasks.splice(index, 1);
    }
};
