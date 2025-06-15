import { AddColumnDto } from "../../dtos";
import { ColumnEntity } from "../../entities/column.entity";
import { ColumnRepository } from "../../repositories/column.repository";

export interface AddColumnUseCase {
  execute(dto: AddColumnDto): Promise<ColumnEntity>
}

export class AddColumn implements AddColumnUseCase {
  constructor(
    private readonly repository: ColumnRepository
  ) {}

  execute(dto: AddColumnDto): Promise<ColumnEntity> {
    return this.repository.add(dto);
  }
}
