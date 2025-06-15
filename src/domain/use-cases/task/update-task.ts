import { UpdateTaskDto } from "../../dtos";
import { TaskEntity } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export interface UpdateTaskUseCase {
  execute(dto: UpdateTaskDto): Promise<TaskEntity>
}

export class UpdateTask implements UpdateTaskUseCase {
  constructor(
    private readonly repository: TaskRepository
  ) {}

  execute(dto: UpdateTaskDto): Promise<TaskEntity> {
    return this.repository.updateById(dto);
  }
}
