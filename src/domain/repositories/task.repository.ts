import { CreateTaskDto, DeleteTaskDto, UpdateTaskDto, ReadTasksByStatusDto} from "../dtos";
import { TaskEntity } from "../entities/task.entity";

export abstract class TaskRepository {

  /**
   * Crea una nueva tarea a partir de un DTO válido.
   * @param createTaskDto Objeto con la información de la nueva tarea.
   */
    abstract create(createTaskDto: CreateTaskDto): Promise<TaskEntity>;
    
    
  abstract updateById(updateTaskDto: UpdateTaskDto): Promise<TaskEntity>;

    abstract deleteById(deleteTaskDto:DeleteTaskDto): Promise<TaskEntity>;

    abstract getTasksByStatus(readTasksByStatusDto: ReadTasksByStatusDto): Promise<TaskEntity[]>;
    
//   abstract getAllByUser(userId: string): Promise<TaskEntity[]>;


  
//   abstract findById(id: string): Promise<TaskEntity>;

  

  

}