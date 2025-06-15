// import { CreateTable } from "../domain/use-cases/create-table.use-case";
// import { SaveFile } from "../domain/use-cases/save-file.use-case";

import { ApolloServer, gql } from 'apollo-server';
import prisma from '../data/postgres';


interface RunOptions {
    welComeMessage?: string;
}


export class ServerApp {
    // static run(options: RunOptions) {
    static run({welComeMessage = 'Bienvenido a la aplicación llamada "Tareas por Hacer"'}: RunOptions) {// Desestructuración de opciones
        
        console.log(`\n\n${welComeMessage}`);

        const typeDefs = gql`
        
        type Task {
            id: ID!
            title: String!
            columnId: ID!
            userId: ID!
            columnOrder: Int!
        }

        type Query {
            allTasks(userId: ID!): [Task]!
            tasksByStatus(status: String!, userId: ID!): [Task]!
        }

        type Column {
            id: ID!
            title: String!
            userId: ID!
            isFixed: Boolean!
            order: Int!
        }

        type Mutation {
            createTask(title: String!, status: String!, userId: ID!): Task!
            updateTask(taskId: ID!, title: String, status: String): Task!
            deleteTask(taskId: ID!): Task!
            addColumn(columnName: String!, userId: ID!): Column!
            reorderColumns(newOrder: [ID!]!, userId: ID!): [Column]!
            deleteColumn(columnId: ID!, userId: ID!): Boolean!
        }
        `;

        const resolvers = {
            Query: {

                // READ ALL
                allTasks: async (root: any, {userId}: {userId: string}) => {// root es la informacion previa. Es literalmente la informacion o el objeto que se retorna al hacer la query anterior.

                    return await prisma.task.findMany({
                        where: { userId: userId }
                    });
                    // return await prisma.user.findUnique({
                    //     where: { id: userId },
                    //     include: {
                    //         tasks: true,
                    //     }

                    // });
                },

                // READ BY STATUS
                tasksByStatus: async (root: any, { status, userId }: { status: string; userId: string }) => {
                    
                    console.log('TASKSSSS BY STATUS');

                    if (!status) {
                        throw new Error('Campos requeridos: userId y status');
                    }

                    const column = await prisma.column.findFirst({
                        where: { title: status }
                    });

                    if (!column) {
                        throw new Error(`No se encontró una columna con el estado: ${status}`);
                    }

                    return await prisma.task.findMany({
                        where: { userId: userId, columnId: column.id }
                    });
                }
            },

            Mutation: {
                
                // CREATE
                createTask: async (root: any, { title, status, userId }: { title: string, status: string;  userId: string }) => {
                    if (!title || !status) {
                        throw new Error('Campos requeridos: title y status');
                    }

                    const column = await prisma.column.findFirst({
                        where: { title: status }
                    });

                    if (!column) {
                        throw new Error(`No se encontró una columna con el ID: ${status}`);
                    }

                    return await prisma.task.create({
                        data: {
                            title,
                            userId: userId,
                            columnId: column.id
                        }
                    });
                },

                // UPDATE
                updateTask: async (root: any, { taskId, title, status }: { taskId: string, title?: string, status?: string }) => {
                    if (!taskId) {
                        throw new Error('Campo requerido: taskId');
                    }

                    const task = await prisma.task.findUnique({
                        where: { id: taskId }
                    });

                    if (!task) {
                        throw new Error(`No se encontró una tarea con el ID: ${taskId}`);
                    }

                    const dataToUpdate: any = {};
                    if (title) dataToUpdate.title = title;
                    if (status) {
                        const column = await prisma.column.findFirst({
                            where: { title: status }
                        });
                        if (!column) {
                            throw new Error(`No se encontró una columna con el estado: ${status}`);
                        }
                        dataToUpdate.columnId = column.id;
                    }

                    return await prisma.task.update({
                        where: { id: taskId },
                        data: dataToUpdate
                    });
                },

                // DELETE
                deleteTask: async (root: any, { taskId }: { taskId: string }) => {
                    if (!taskId) {
                        throw new Error('Campo requerido: taskId');
                    }

                    const task = await prisma.task.findUnique({
                        where: { id: taskId }
                    });

                    if (!task) {
                        throw new Error(`No se encontró una tarea con el ID: ${taskId}`);
                    }

                    return await prisma.task.delete({
                        where: { id: taskId }
                    });
                },


                // 2. Usuario tiene la posibilidad de agregar dos columnas mas (5 como maximo, ya que por defecto tiene 3: DONE, IN PROGRESS, TODO)
                addColumn: async (root: any, { columnName, userId }: { columnName: string;  userId: string }) => {
                    const userColumns = await prisma.column.findMany({
                        where: { userId: userId }
                    });

                    if (userColumns.length >= 5) {
                        throw new Error('El usuario ya tiene el máximo de 5 columnas permitidas');
                    }

                    // Verificar si la columna ya existe
                    const existingColumn = userColumns.find(column => column.title === columnName);
                    if (existingColumn) {
                        throw new Error(`La columna con el nombre "${columnName}" ya existe`);
                    }

                    return await prisma.column.create({
                        data: {
                            title: columnName,
                            userId: userId,
                            isFixed: false,
                            order: userColumns.length + 1
                        }
                    });
                },

                // 3. Usuario puede reorganizar las columnas y guardar el estado de las mismas
                reorderColumns: async (root: any, { newOrder, userId }: { newOrder: string[];  userId: string }) => {
                    const updates = newOrder.map((columnId, index) =>
                        prisma.column.update({
                        where: { id: columnId },
                        data: { order: index + 1 }
                        })
                    );
                    await Promise.all(updates);
                    return prisma.column.findMany({
                        where: { userId: userId },
                        orderBy: { order: 'asc' }
                    });
                },

                
                deleteColumn: async (root: any, { columnId, userId }: { columnId: string;  userId: string }) => {
                    const columnToDelete = await prisma.column.findUnique({
                        where: { id: columnId }
                    });

                    // 5. Columnas originaes (TODO, IN PROGRESS, DONE) (que tienen id columnId) que se pretendan eliminar  no pueden ser eliminadas

                    if (!columnToDelete || columnToDelete.isFixed) {
                        throw new Error('Esta columna no puede ser eliminada');
                    }

                    // 4. Si hay tareas en una columna (cuyo id es columnId) que fue eliminada o se quiere elminar (columna se elimina si isFixed es false), las tareas se mueven a la columna TODO
                    const todoColumn = await prisma.column.findFirst({
                        where: {
                            userId: userId,
                            title: "TODO"
                        }
                    });

                    console.log('TODO Column:', todoColumn?.id);

                    // if (!todoColumn) {
                    //     throw new Error('No se encontró la columna TODO del usuario');
                    // }

                    // Mover tareas a TODO
                    await prisma.task.updateMany({
                        where: { columnId },
                        data: { columnId: todoColumn!.id }
                    });

                    // Eliminar columna
                    await prisma.column.delete({
                        where: { id: columnId }
                    });

                    return true;
                }

            },

            // Tests
            Task: {
                columnOrder: async(root: any) => {
                    // Obtener el orden de la columna a la que pertenece la tarea
                    const column = await prisma.column.findUnique({
                        where: { id: root.columnId }
                    });

                    if (!column) {
                        throw new Error(`No se encontró una columna con el ID: ${root.columnId}`);
                    }

                    return column.order; // Retorna el orden de la columna
                }
            }
        }

        const server = new ApolloServer({
            typeDefs: typeDefs,
            resolvers: resolvers,
        });
        
        server.listen().then(({ url }) => {
            console.log(`Servidor corriendo en ${url}`);
        });
    }
}