export class ColumnEntity {

  constructor(
    public id: string,         // obligatorio
    public title: string,      // obligatorio
    public userId: string,      // obligatorio
    public isFixed?: boolean,
    public order?: number
  ) {}

  // Ejemplo de propiedad derivada: podrías cambiarlo por otra lógica útil
//   get isAssignedToColumn() {
//     return !!this.columnId;
//   }

  public static fromObject(object: { [key: string]: any }): ColumnEntity {
    const { id, title, userId, isFixed, order } = object;

    // Validaciones básicas
    if (!id) throw 'ColumnEntity: id is required';
    if (!title) throw 'ColumnEntity: title is required';
    if (!userId) throw 'ColumnEntity: userId is required';
    if (!order) throw 'ColumnEntity: order is required';
      

    // Validar tipo de dato numérico si columnOrder está definido
    let newColumnOrder: number | undefined = undefined;
    if (order !== undefined && order !== null) {
      newColumnOrder = Number(order);
      if (isNaN(newColumnOrder)) {
        throw 'ColumnEntity: columnOrder must be a valid number';
      }
    }

    return new ColumnEntity(id, title, userId, !!isFixed, newColumnOrder);
  }
}
