import prisma from "../../data/postgres";

import {
  CreateTaskDto,
  UpdateTaskDto,
    TaskDatasource,
    DeleteTaskDto,
TaskEntity,
ReadTasksByStatusDto,
ReadTasksByUserDto,
//   CustomError
} from "../../domain";

export class TaskDatasourceImpl implements TaskDatasource {

    async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
      
        const column = await prisma.column.findFirst({
            where: { title: createTaskDto.status }
        });

        if (!column) {
            throw new Error(`No se encontró una columna con el estado: ${status}`);
        }


        const task = await prisma.task.create({
            data: {
                title: createTaskDto.title,
                userId: createTaskDto.userId,
                columnId: column.id
            }
        });

        return TaskEntity.fromObject(task);
    }
    
    async updateById(updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
        
        const { taskId, title, status } = updateTaskDto;

        if (!taskId) {
            throw new Error('Campo requerido: taskId');
        }

        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            throw new Error(`No se encontró una tarea con el ID: ${taskId}`);
        }

        const dataToUpdate: any = {};
        if (title) dataToUpdate.title = title;
        if (status) {
            const column = await prisma.column.findFirst({
                where: { title: status }
            });
            if (!column) {
                throw new Error(`No se encontró una columna con el estado: ${status}`);
            }
            dataToUpdate.columnId = column.id;
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: dataToUpdate
        });

        return TaskEntity.fromObject(updatedTask);
        

    }


    async deleteById(deleteTaskDto: DeleteTaskDto): Promise<TaskEntity> {
        
        const { taskId } = deleteTaskDto;

        if (!taskId) {
            throw new Error('Campo requerido: taskId');
        }

        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            throw new Error(`No se encontró una tarea con el ID: ${taskId}`);
        }

        // return await prisma.task.delete({
        //     where: { id: taskId }
        // });

        await prisma.task.delete({
            where: { id: taskId }
        });

        return TaskEntity.fromObject(task);
    }


    async getTasksByStatus(readTasksByStatusDto: ReadTasksByStatusDto): Promise<TaskEntity[]> {
        const { userId, status } = readTasksByStatusDto;

        if (!userId || !status) {
            throw new Error('Campos requeridos: userId y status');
        }

        const column = await prisma.column.findFirst({
            where: { title: status, userId: userId }
        });

        if (!column) {
            throw new Error(`No se encontró una columna con el estado: ${status}`);
        }

        // return await prisma.task.findMany({
        //     where: { userId: userId, columnId: column.id }
        // });

        const tasks = await prisma.task.findMany({
            where: { userId: userId, columnId: column.id },
        });

        return tasks.map(task => TaskEntity.fromObject(task));
    }


    async getAllByUser(readTasksByUserDto: ReadTasksByUserDto): Promise<TaskEntity[]> {
        
        const { userId } = readTasksByUserDto;

        if (!userId) {
            throw new Error('Campo requerido: userId');
        }

        // return await prisma.task.findMany({
        //     where: { userId: userId },
        // });

        const tasks = await prisma.task.findMany({
            where: { userId: userId },
        });

        return tasks.map(task => TaskEntity.fromObject(task));

    }

}