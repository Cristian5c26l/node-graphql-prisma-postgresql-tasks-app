import prisma from "./postgres";

export const seed = async () => {
  // Eliminar primero las tablas que no dependen de otras. La tabla Task tiene registros de tareas que pertenecen a columnas y usuarios. Por ello, se puede eliminar primero.
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.user.deleteMany();


  // Crear un usuario por defecto
  const user = await prisma.user.create({
    data: { name: "Spiderman" },
  });

  // Crear columnas por defecto para el usuario
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

  // Obtener las columnas del usuario
  const columns = await prisma.column.findMany(
    {
      where: { userId: user.id },
      orderBy: { order: "asc" },
    }
  );

  // Crear tareas por defecto para el usuario
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

  // 2. Crear otro usuario por defecto
  const user2 = await prisma.user.create({
    data: { name: "Mario" },
  });

  // Crear columnas por defecto para el segundo usuario
  for (const [index, columnName] of defaultColumns.entries()) {
    await prisma.column.create({
      data: {
        title: columnName,
        userId: user2.id,
        isFixed: true,
        order: index + 1,
      },
    });
  }

  // Obtener las columnas del segundo usuario
  const columns2 = await prisma.column.findMany({
    where: { userId: user2.id },
    orderBy: { order: "asc" },
  });

  // Crear tareas por defecto para el segundo usuario
  await prisma.task.createMany({
    data: [
      { title: "Perfeccionar desarrollo frontend", userId: user2.id, columnId: columns2[0].id },
      { title: "Perfeccionar desarrollo backend", userId: user2.id, columnId: columns2[1].id },
      { title: "Ordenar biblioteca de libros", userId: user2.id, columnId: columns2[2].id },
    ],
  });



  console.log("SEED EXECUTED! :)");
};
