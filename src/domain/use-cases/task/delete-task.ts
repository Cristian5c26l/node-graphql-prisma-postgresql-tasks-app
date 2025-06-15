import { DeleteTaskDto } from "../../dtos";
import { TaskEntity } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export interface DeleteTaskUseCase {
  execute(dto: DeleteTaskDto): Promise<TaskEntity>
}

export class DeleteTask implements DeleteTaskUseCase {
  constructor(
    private readonly repository: TaskRepository
  ) {}

  execute(dto: DeleteTaskDto): Promise<TaskEntity> {
    return this.repository.deleteById(dto);
  }
}
