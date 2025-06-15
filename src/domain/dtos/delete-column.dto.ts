

export class DeleteColumnDto {

    constructor(
        public readonly columnId: string,
        public readonly userId: string

    ) {
    }

    static create(props: { [key: string]: any }): [string?, DeleteColumnDto?] {
        const { columnId, userId } = props;
        if (!columnId || typeof columnId !== 'string') {
            return ['Column ID is required and must be a string'];
        }
        
        if (!userId || typeof userId !== 'string') {
            return ['User ID is required and must be a string'];
        }

        return [undefined, new DeleteColumnDto(columnId.trim(), userId.trim())];
    }
}