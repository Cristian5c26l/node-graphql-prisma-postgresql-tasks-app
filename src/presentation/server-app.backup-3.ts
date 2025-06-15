// import { CreateTable } from "../domain/use-cases/create-table.use-case";
// import { SaveFile } from "../domain/use-cases/save-file.use-case";

import { ApolloServer, gql } from 'apollo-server';
import prisma from '../data/postgres';

import { TaskRepositoryImpl } from '../infrastructure/repositories/task.repository.impl';
import { TaskDatasourceImpl } from '../infrastructure/datasources/task.datasource.impl';
import { CreateTask, UpdateTask, DeleteTask, ReadTasksByStatus } from '../domain/';
import { CreateTaskDto, UpdateTaskDto, DeleteTaskDto, ReadTasksByStatusDto } from '../domain/dtos';


interface RunOptions {
    welComeMessage?: string;
}


export class ServerApp {
    // static run(options: RunOptions) {
    static run({welComeMessage = 'Bienvenido a la aplicación llamada "Tareas por Hacer"'}: RunOptions) {// Desestructuración de opciones
        
        console.log(`\n\n${welComeMessage}`);

        const taskRepository = new TaskRepositoryImpl(new TaskDatasourceImpl());

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

                

                // Utilizando el caso de uso ReadTasksByStatus
                tasksByStatus: (root: any, { status, userId }: { status: string; userId: string }) => {
                    

                    const [error, readTasksByStatusDto] = ReadTasksByStatusDto.create({ userId, status });

                    if (error) {
                        throw new Error(error);
                    }

                    return new ReadTasksByStatus(taskRepository)
                        .execute(readTasksByStatusDto!)
                        .catch((error: any) => {
                            console.error('Error fetching tasks by status:', error);
                            throw new Error(error.message ?? 'Unexpected error');
                        });
                }
            },

            Mutation: {
                
                

                // Utilizando el caso de uso CreateTask
                createTask: (_: any, { title, status, userId }: { title: string, status: string;  userId: string }) => {
                    
                    const [error, createTaskDto] = CreateTaskDto.create({ title, userId, status });
                    
                    if (error) {
                        throw new Error(error);
                    }

                    return new CreateTask(taskRepository)
                        .execute(createTaskDto!)
                        .catch((error: any) => {
                            console.error('Error creating task:', error);
                            throw new Error(error.message ?? 'Unexpected error');
                        });

                },


                // Utilizando el caso de uso UpdateTask
                updateTask: (root: any, { taskId, title, status }: { taskId: string, title?: string, status?: string }) => {
                    

                    const [error, updateTaskDto] = UpdateTaskDto.create({ taskId, title, status });

                    if (error) {
                        throw new Error(error);
                    }

                    return new UpdateTask(taskRepository)
                        .execute(updateTaskDto!)
                        .catch((error: any) => {
                            console.error('Error updating task:', error);
                            throw new Error(error.message ?? 'Unexpected error');
                        });

                },


                // Utilizando el caso de uso UpdateTask
                deleteTask: (root: any, { taskId }: { taskId: string }) => {
                   

                    const [error, deleteTaskDto] = DeleteTaskDto.create({ taskId });

                    if (error) {
                        throw new Error(error);
                    }

                    return new DeleteTask(taskRepository)
                        .execute(deleteTaskDto!)
                        .catch((error: any) => {
                            console.error('Error deleting task:', error);
                            throw new Error(error.message ?? 'Unexpected error');
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