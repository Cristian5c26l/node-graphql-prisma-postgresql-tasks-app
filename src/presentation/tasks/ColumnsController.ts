import {
    AddColumn,
    DeleteColumn,
    LineUpUserColumns,

    ColumnRepository,
} from "../../domain";
import {
    AddColumnDto,
    DeleteColumnDto,
    LineUpUserColumnsDto,
} from "../../domain/dtos";

export class ColumnsController {
    constructor(private readonly columnRepository: ColumnRepository) { }

    public addColumn = (
      root: any,
      { columnName, userId }: { columnName: string; userId: string }
    ) => {
        const [error, addColumnDto] = AddColumnDto.create({
            columnName,
            userId,
        });

        if (error) {
            throw new Error(error);
        }

        return new AddColumn(this.columnRepository)
            .execute(addColumnDto!)
            .catch((error: any) => {
                console.error("Error adding column:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    };


    public deleteColumn = (
      root: any,
      { columnId, userId }: { columnId: string; userId: string }
    ) => {
        const [error, deleteColumnDto] = DeleteColumnDto.create({ columnId, userId });

        if (error) {
            throw new Error(error);
        }

        return new DeleteColumn(this.columnRepository)// DeleteColumn es el Caso de Uso
            .execute(deleteColumnDto!)
            .catch((error: any) => {
                console.error("Error deleting column:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    };

    public lineUpUserColumns = (
      root: any,
      { newOrder, userId }: { newOrder: string[]; userId: string }
    ) => {
        const [error, lineUpUserColumnsDto] = LineUpUserColumnsDto.create({
            newOrder,
            userId,
        });

        if (error) {
            throw new Error(error);
        }

        return new LineUpUserColumns(this.columnRepository)
            .execute(lineUpUserColumnsDto!)
            .catch((error: any) => {
                console.error("Error lining up user columns:", error);
                throw new Error(error.message ?? "Unexpected error");
            });
    }
}
