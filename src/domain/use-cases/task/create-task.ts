import { CreateTaskDto } from "../../dtos";
import { TaskEntity } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export interface CreateTaskUseCase {
  execute(dto: CreateTaskDto): Promise<TaskEntity>
}

export class CreateTask implements CreateTaskUseCase {
  constructor(
    private readonly repository: TaskRepository
  ) {}

  execute(dto: CreateTaskDto): Promise<TaskEntity> {
    return this.repository.create(dto);
  }
}
