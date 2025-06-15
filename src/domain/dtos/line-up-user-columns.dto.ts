

export class LineUpUserColumnsDto {

    constructor(
        public readonly newOrder: string[],
        public readonly userId: string

    ) {
    }

    static create(props: { [key: string]: any }): [string?, LineUpUserColumnsDto?] {
        const { newOrder, userId } = props;
        
        
        if (!Array.isArray(newOrder) || newOrder.length === 0) {
            return ['New order must be a non-empty array of column IDs'];
        }

        if (!userId || typeof userId !== 'string') {
            return ['User ID is required and must be a string'];
        }

        return [undefined, new LineUpUserColumnsDto(newOrder, userId.trim())];
    }
}