import { ReadTasksByStatusDto } from "../../dtos";
import { TaskEntity } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export interface ReadTasksByStatusDtoUseCase {
  execute(dto: ReadTasksByStatusDto): Promise<TaskEntity[]>
}

export class ReadTasksByStatus implements ReadTasksByStatusDtoUseCase {
  constructor(
    private readonly repository: TaskRepository
  ) {}

  execute(dto: ReadTasksByStatusDto): Promise<TaskEntity[]> {
      return this.repository.getTasksByStatus(dto);
  }
}
