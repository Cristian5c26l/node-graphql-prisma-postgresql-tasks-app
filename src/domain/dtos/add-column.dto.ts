

export class AddColumnDto {
  private constructor(
    public readonly columnName: string,
    public readonly userId: string,
  ) {}

  static create(props: { [key: string]: any }): [string?, AddColumnDto?] {
    const { columnName, userId } = props;

    if (!columnName || typeof columnName !== 'string') {
      return ['ColumnName is required and must be a string'];
    }
    
    if (!userId || typeof userId !== 'string') {
      return ['UserId is required and must be a string'];
    }


    return [undefined, new AddColumnDto(columnName.trim(), userId.trim())];
  }
}
