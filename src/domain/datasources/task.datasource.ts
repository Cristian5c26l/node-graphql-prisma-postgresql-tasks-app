import { CreateTaskDto, DeleteTaskDto, UpdateTaskDto, ReadTasksByStatusDto } from '../dtos';
import { TaskEntity } from '../entities/task.entity';

export abstract class TaskDatasource {

  /**
   * Crea una nueva tarea a partir de un DTO válido.
   * @param createTaskDto Contiene título, userId y columnId (derivado del estado)
   */
  abstract create(createTaskDto: CreateTaskDto): Promise<TaskEntity>;

  abstract updateById(updateTaskDto: UpdateTaskDto): Promise<TaskEntity>;

    abstract deleteById(deleteTaskDto: DeleteTaskDto): Promise<TaskEntity>;
    
    abstract getTasksByStatus(readTasksByStatusDto: ReadTasksByStatusDto): Promise<TaskEntity[]>;

}
