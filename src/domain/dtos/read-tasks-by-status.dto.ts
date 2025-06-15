// Basado en: { status, userId }: { status: string; userId: string }




export class ReadTasksByStatusDto {

    constructor(
        public readonly status: string,
        public readonly userId: string
    ) {
    }

    static create(props: { [key: string]: any }): [string?, ReadTasksByStatusDto?] {
        const { status, userId } = props;

        if (!status || typeof status !== 'string') {
            return ['Status is required and must be a string'];
        }

        if (!userId || typeof userId !== 'string') {
            return ['UserId is required and must be a string'];
        }

        return [undefined, new ReadTasksByStatusDto(status.trim(), userId.trim())];
    }
}