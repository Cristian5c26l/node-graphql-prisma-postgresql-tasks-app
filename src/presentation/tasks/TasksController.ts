import {
    CreateTask,
    DeleteTask,
    ReadTasksByStatus,
    ReadTasksByUser,
    UpdateTask,
    TaskRepository,
} from "../../domain";
import {
    CreateTaskDto,
    DeleteTaskDto,
    ReadTasksByStatusDto,
    ReadTasksByUserDto,
    UpdateTaskDto,
} from "../../domain/dtos";

export class TasksController {
    constructor(private readonly taskRepository: TaskRepository) { }

    public getTasksByUser = (root: any, { userId }: { userId: string }) => {
        const [error, readTasksByUserDto] = ReadTasksByUserDto.create({ userId });

        if (error) {
            throw new Error(error);
        }

        return new ReadTasksByUser(this.taskRepository)
            .execute(readTasksByUserDto!)
            .catch((error: any) => {
                console.error("Error fetching tasks by user:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    };

    public getTasksByStatus = (
      root: any,
      { status, userId }: { status: string; userId: string }
    ) => {
        const [error, readTasksByStatusDto] = ReadTasksByStatusDto.create({
            userId,
            status,
        });

        if (error) {
            throw new Error(error);
        }

        return new ReadTasksByStatus(this.taskRepository)
            .execute(readTasksByStatusDto!)
            .catch((error: any) => {
                console.error("Error fetching tasks by status:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    };

    public createTask = (
      root: any,
      {
        title,
        status,
        userId,
      }: { title: string; status: string; userId: string }
    ) => {
        const [error, createTaskDto] = CreateTaskDto.create({
            title,
            userId,
            status,
        });

        if (error) {
            throw new Error(error);
        }

        return new CreateTask(this.taskRepository)
            .execute(createTaskDto!)
            .catch((error: any) => {
                console.error("Error creating task:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    };

    public updateTask = (
      root: any,
      {
        taskId,
        title,
        status,
      }: { taskId: string; title?: string; status?: string }
    ) => {
        const [error, updateTaskDto] = UpdateTaskDto.create({
            taskId,
            title,
            status,
        });

        if (error) {
            throw new Error(error);
        }

        return new UpdateTask(this.taskRepository)
            .execute(updateTaskDto!)
            .catch((error: any) => {
                console.error("Error updating task:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    };

    public deleteTask = (root: any, { taskId }: { taskId: string }) => {
        const [error, deleteTaskDto] = DeleteTaskDto.create({ taskId });

        if (error) {
            throw new Error(error);
        }

        return new DeleteTask(this.taskRepository)
            .execute(deleteTaskDto!)
            .catch((error: any) => {
                console.error("Error deleting task:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    };
}
