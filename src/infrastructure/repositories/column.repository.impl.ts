import {
  AddColumnDto,
  DeleteColumnDto,
  LineUpUserColumnsDto,
  ColumnDatasource,
  ColumnRepository,
  ColumnEntity,
  
} from "../../domain";

export class ColumnRepositoryImpl implements ColumnRepository {
  constructor(private readonly datasource: ColumnDatasource) {}
  
  
  async add(addColumnDto: AddColumnDto): Promise<ColumnEntity> {
    return this.datasource.add(addColumnDto);
  }
  async delete(deleteColumnDto: DeleteColumnDto): Promise<ColumnEntity[]> {
    return this.datasource.delete(deleteColumnDto);
  }
  async lineUpUserColumns(lineUpUserColumnsDto: LineUpUserColumnsDto): Promise<ColumnEntity[]> {
    return this.datasource.lineUpUserColumns(lineUpUserColumnsDto);
  }

  

}
