import {
  CreateTaskDto,
  UpdateTaskDto,
    DeleteTaskDto,
    ReadTasksByStatusDto,
  TaskDatasource,
  TaskRepository,
  TaskEntity,
  ReadTasksByUserDto,
} from "../../domain";

export class TaskRepositoryImpl implements TaskRepository {
  constructor(private readonly datasource: TaskDatasource) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.datasource.create(createTaskDto);
  }

  async updateById(updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return this.datasource.updateById(updateTaskDto);
  }

  async deleteById(deleteTaskDto:DeleteTaskDto): Promise<TaskEntity> {
    return this.datasource.deleteById(deleteTaskDto);
    }
    
    async getTasksByStatus(readTasksByStatusDto: ReadTasksByStatusDto): Promise<TaskEntity[]> {
        return this.datasource.getTasksByStatus(readTasksByStatusDto);
  }
  

  async getAllByUser(readTasksByUserDto: ReadTasksByUserDto): Promise<TaskEntity[]> {
      return this.datasource.getAllByUser(readTasksByUserDto);
  }

}
