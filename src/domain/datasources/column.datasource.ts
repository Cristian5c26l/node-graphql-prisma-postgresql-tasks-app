import { AddColumnDto, DeleteColumnDto, LineUpUserColumnsDto } from '../dtos';
import { ColumnEntity } from '../entities/column.entity';

export abstract class ColumnDatasource {


  abstract add(addColumnDto: AddColumnDto): Promise<ColumnEntity>;

  abstract delete(deleteColumnDto: DeleteColumnDto): Promise<ColumnEntity[]>;
    
  abstract lineUpUserColumns(lineUpUserColumnsDto: LineUpUserColumnsDto): Promise<ColumnEntity[]>;// Reordenar columnas de un usuario

}
