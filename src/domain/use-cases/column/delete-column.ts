import { DeleteColumnDto } from "../../dtos";
import { ColumnEntity } from "../../entities/column.entity";
import { ColumnRepository } from "../../repositories/column.repository";

export interface DeleteColumnUseCase {
  execute(dto: DeleteColumnDto): Promise<ColumnEntity[]>
}

export class DeleteColumn implements DeleteColumnUseCase {
  constructor(
    private readonly repository: ColumnRepository
  ) {}

  execute(dto: DeleteColumnDto): Promise<ColumnEntity[]> {
    return this.repository.delete(dto);
  }
}
