import { LineUpUserColumnsDto } from "../../dtos";
import { ColumnEntity } from "../../entities/column.entity";
import { ColumnRepository } from "../../repositories/column.repository";

export interface LineUpUserColumnsUseCase {
  execute(dto: LineUpUserColumnsDto): Promise<ColumnEntity[]>
}

export class LineUpUserColumns implements LineUpUserColumnsUseCase {
  constructor(
    private readonly repository: ColumnRepository
  ) {}

  execute(dto: LineUpUserColumnsDto): Promise<ColumnEntity[]> {
    return this.repository.lineUpUserColumns(dto);
  }
}
