import prisma from "./postgres";

export const seed = async () => {
  // Eliminar primero las tablas que no dependen de otras. La tabla Task tiene registros de tareas que pertenecen a columnas y usuarios. Por ello, se puede eliminar primero.
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: { name: "Spiderman" },
  });

  const defaultColumns = ["TODO", "IN PROGRESS", "DONE"];

  for (const [index, columnName] of defaultColumns.entries()) {
    await prisma.column.create({
      data: {
        title: columnName,
        userId: user.id,
        isFixed: true,
        order: index + 1,
      },
    });
  }

  const columns = await prisma.column.findMany();

  await prisma.task.createMany({
    data: [
      { title: "Tarea 1", userId: user.id, columnId: columns[0].id },
      { title: "Tarea 2", userId: user.id, columnId: columns[0].id },
      { title: "Tarea 3", userId: user.id, columnId: columns[1].id },
      { title: "Tarea 4", userId: user.id, columnId: columns[2].id },
      { title: "Tarea 5", userId: user.id, columnId: columns[2].id },
      { title: "Tarea 6", userId: user.id, columnId: columns[2].id },
    ],
  });

  console.log("SEED EXECUTED! :)");
};
