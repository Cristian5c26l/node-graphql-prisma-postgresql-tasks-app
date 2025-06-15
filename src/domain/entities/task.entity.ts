export class TaskEntity {

  constructor(
    public id: string,         // obligatorio
    public title: string,      // obligatorio
    public columnId: string,   // obligatorio
    public userId: string,     // obligatorio
    public columnOrder?: number  // opcional
  ) {}

  // Ejemplo de propiedad derivada: podrías cambiarlo por otra lógica útil
//   get isAssignedToColumn() {
//     return !!this.columnId;
//   }

  public static fromObject(object: { [key: string]: any }): TaskEntity {
    const { id, title, columnId, userId, columnOrder } = object;

    // Validaciones básicas
    if (!id) throw 'TaskEntity: id is required';
    if (!title) throw 'TaskEntity: title is required';
    if (!columnId) throw 'TaskEntity: columnId is required';
    if (!userId) throw 'TaskEntity: userId is required';

    // Validar tipo de dato numérico si columnOrder está definido
    let newColumnOrder: number | undefined = undefined;
    if (columnOrder !== undefined && columnOrder !== null) {
      newColumnOrder = Number(columnOrder);
      if (isNaN(newColumnOrder)) {
        throw 'TaskEntity: columnOrder must be a valid number';
      }
    }

    return new TaskEntity(id, title, columnId, userId, newColumnOrder);
  }
}
