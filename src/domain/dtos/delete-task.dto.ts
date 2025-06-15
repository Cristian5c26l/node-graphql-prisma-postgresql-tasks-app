

export class DeleteTaskDto {

    constructor(
      public readonly taskId: string

    ) {
    }

    static create(props: { [key: string]: any }): [string?, DeleteTaskDto?] {
        const { taskId } = props;

        if (!taskId || typeof taskId !== 'string') {
            return ['Task ID is required and must be a string'];
        }

        return [undefined, new DeleteTaskDto(taskId.trim())];
    }
}