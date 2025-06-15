import { ReadTasksByUserDto } from "../../dtos";
import { TaskEntity } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";

export interface ReadTasksByUserUseCase {
  execute(dto: ReadTasksByUserDto): Promise<TaskEntity[]>
}

export class ReadTasksByUser implements ReadTasksByUserUseCase {
  constructor(
    private readonly repository: TaskRepository
  ) {}

  execute(dto: ReadTasksByUserDto): Promise<TaskEntity[]> {
      return this.repository.getAllByUser(dto);
  }
}
