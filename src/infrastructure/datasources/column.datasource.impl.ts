import prisma from "../../data/postgres";

import {
    ColumnDatasource,
    ColumnEntity,
    AddColumnDto,
    DeleteColumnDto,
    LineUpUserColumnsDto,
//   CustomError
} from "../../domain";

export class ColumnDatasourceImpl implements ColumnDatasource {


    async add(addColumnDto: AddColumnDto): Promise<ColumnEntity> {
        

        const { columnName, userId } = addColumnDto;

        if (!columnName || !userId) {
            throw new Error('Campos requeridos: columnName y userId');
        }

        const userColumns = await prisma.column.findMany({
            where: { userId: userId }
        });

        if (userColumns.length >= 5) {
            throw new Error("El usuario ya tiene el máximo de 5 columnas permitidas");
        }

        // Verificar si la columna ya existe
        const existingColumn = userColumns.find(
            (column) => column.title === columnName
        );
        if (existingColumn) {
            throw new Error(`La columna con el nombre "${columnName}" ya existe`);
        }

        // return await prisma.column.create({
        //     data: {
        //         title: columnName,
        //         userId: userId,
        //         isFixed: false,
        //         order: userColumns.length + 1
        //     }
        // });

        const newColumn = await prisma.column.create({
            data: {
                title: columnName,
                userId: userId,
                isFixed: false,
                order: userColumns.length + 1
            }
        });

        return ColumnEntity.fromObject(newColumn);

    }


    async delete(deleteColumnDto: DeleteColumnDto): Promise<ColumnEntity[]> {
        
        const { columnId, userId } = deleteColumnDto;

        if (!columnId || !userId) {
            throw new Error('Campos requeridos: columnId y userId');
        }

        const columnToDelete = await prisma.column.findUnique({
            where: { id: columnId }
        });

        // 5. Columnas originaes (TODO, IN PROGRESS, DONE) (que tienen id columnId) que se pretendan eliminar  no pueden ser eliminadas
        if (!columnToDelete || columnToDelete.isFixed) {
            throw new Error("Esta columna no puede ser eliminada");
        }

        // 4. Si hay tareas en una columna (cuyo id es columnId) que fue eliminada o se quiere elminar (columna se elimina si isFixed es false), las tareas se mueven a la columna TODO
        const todoColumn = await prisma.column.findFirst({
            where: {
                userId: userId,
                title: "TODO"
            }
        });

        // Mover tareas a TODO
        await prisma.task.updateMany({
            where: { columnId },
            data: { columnId: todoColumn!.id }
        });

        // Eliminar columna
        await prisma.column.delete({
            where: { id: columnId }
        });

        // Las columnas posteriores, disminuyen su orden. Segun el orden de la columna eliminada, las de orden posterior disminuyen su orden en 1
        await prisma.column.updateMany({
            where: {
                userId: userId,
                order: { gt: columnToDelete.order }
            },
            data: { order: { decrement: 1 } }
        });

        // return await prisma.column.findMany({
        //     where: { userId: userId },
        //     orderBy: { order: "asc" }
        // });

        const updatedColumns = await prisma.column.findMany({
            where: { userId: userId },
            orderBy: { order: "asc" }
        });

        return updatedColumns.map(column => ColumnEntity.fromObject(column));

    }

    async lineUpUserColumns(lineUpUserColumnsDto: LineUpUserColumnsDto): Promise<ColumnEntity[]> {
        
        const { newOrder, userId } = lineUpUserColumnsDto;

        if (!newOrder || !userId) {
            throw new Error('Campos requeridos: newOrder y userId');
        }

        // Verificar que el nuevo orden no exceda el número máximo de columnas
        if (newOrder.length > 5) {
            throw new Error("El usuario no puede tener más de 5 columnas");
        }

        // Actualizar el orden de las columnas según el nuevo orden proporcionado
        const updates = newOrder.map((columnId, index) =>
            prisma.column.update({
                where: { id: columnId },
                data: { order: index + 1 }
            })
        );

        await Promise.all(updates);

        // return await prisma.column.findMany({
        //     where: { userId: userId },
        //     orderBy: { order: "asc" }
        // });

        const updatedColumns = await prisma.column.findMany({
            where: { userId: userId },
            orderBy: { order: "asc" }
        });

        return updatedColumns.map(column => ColumnEntity.fromObject(column));

    }

}