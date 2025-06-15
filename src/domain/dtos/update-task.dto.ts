
// id
// title
// columnId


export class UpdateTaskDto {
    private constructor(
        public readonly taskId: string,
        public readonly title?: string,
        public readonly status?: string, // Optional, can be set later
    ) {}
    
    static create(props: { [key: string]: any }): [string?, UpdateTaskDto?] {
        const { taskId, title, columnId } = props;

        if (!taskId || typeof taskId !== 'string') {
            return ['Task ID is required and must be a string'];
        }

        if (title && (typeof title !== 'string' || title.trim().length === 0)) {
            return ['Title must be a non-empty string if provided'];
        }

        if (columnId && typeof columnId !== 'string') {
            return ['Status must be a string if provided'];
        }

        return [undefined, new UpdateTaskDto(taskId.trim(), title?.trim(), columnId?.trim())];
    }
    }