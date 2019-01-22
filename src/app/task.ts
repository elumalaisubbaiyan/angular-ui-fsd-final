export class Task {
    taskId: number;
    parentTaskId: number;
    parentTask: string;
    priority: number;
    task: string;
    status: string;
    startDate: Date;
    endDate: Date;
}