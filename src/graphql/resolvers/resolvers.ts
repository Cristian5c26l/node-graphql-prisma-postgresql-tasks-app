import prisma from "../../data/postgres";

import { TaskRepositoryImpl } from "../../infrastructure/repositories/task.repository.impl";
import { TaskDatasourceImpl } from "../../infrastructure/datasources/task.datasource.impl";
import { TasksController } from '../../presentation/tasks/TasksController';
import { ColumnRepositoryImpl } from "../../infrastructure/repositories/column.repository.impl";
import { ColumnDatasourceImpl } from "../../infrastructure/datasources/column.datasource.impl";
import { ColumnsController } from "../../presentation/tasks/ColumnsController";

const taskDatasource = new TaskDatasourceImpl();
const taskRepository = new TaskRepositoryImpl(taskDatasource);
const taskController = new TasksController(taskRepository);

const columnDatasource = new ColumnDatasourceImpl();
const columnRepository = new ColumnRepositoryImpl(columnDatasource);
const columnController = new ColumnsController(columnRepository);

export const resolvers = {
  Query: {

    // Utilizando el caso de uso ReadTasksByUser a traves del controlador taskController al cual se le inyecta el repositorio taskRepository cuyos metodos son definidos por el datasource taskDatasource
    allTasks: taskController.getTasksByUser,

    // Utilizando el caso de uso ReadTasksByStatus a traves del controlador taskController al cual se le inyecta el repositorio taskRepository cuyos metodos son definidos por el datasource taskDatasource
    tasksByStatus: taskController.getTasksByStatus,

    // Extra para el frontend: obtener todas las columnas de un usuario
    allColumns: async (root: any, { userId }: { userId: string }) => {
      const columns = await prisma.column.findMany({
        where: { userId },
        orderBy: { order: "asc" },
      });

      return columns;
    },
  },

  Mutation: {
    // Utilizando el caso de uso CreateTask a traves del controlador taskController al cual se le inyecta el repositorio taskRepository cuyos metodos son definidos por el datasource taskDatasource
    createTask: taskController.createTask,

    // Utilizando el caso de uso UpdateTask a traves del controlador taskController al cual se le inyecta el repositorio taskRepository cuyos metodos son definidos por el datasource taskDatasource
    updateTask: taskController.updateTask,

    // Utilizando el caso de uso UpdateTask a traves del controlador taskController al cual se le inyecta el repositorio taskRepository cuyos metodos son definidos por el datasource taskDatasource
    deleteTask: taskController.deleteTask,

    // 2. Usuario tiene la posibilidad de agregar dos columnas mas (5 como maximo, ya que por defecto tiene 3: DONE, IN PROGRESS, TODO)
    addColumn: columnController.addColumn,

    // 3. Usuario puede reorganizar las columnas y guardar el estado de las mismas
    reorderColumns: columnController.lineUpUserColumns,

    deleteColumn: columnController.deleteColumn,


    
  },

  Task: {
    columnOrder: async (root: any) => {
      // Obtener el orden de la columna a la que pertenece la tarea
      const column = await prisma.column.findUnique({
        where: { id: root.columnId },
      });

      if (!column) {
        throw new Error(
          `No se encontró una columna con el ID: ${root.columnId}`
        );
      }

      return column.order; // Retorna el orden de la columna
    },
  },
};
