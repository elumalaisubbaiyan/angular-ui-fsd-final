export class Task {
    markedParent: boolean;
    taskId: number;
    projectId: number;
    projectName: string;
    parentTaskId: number;
    parentTask: string;
    priority: number;
    task: string;
    status: string;
    startDate: Date;
    endDate: Date;
    userId: number;
    userName: string;
}