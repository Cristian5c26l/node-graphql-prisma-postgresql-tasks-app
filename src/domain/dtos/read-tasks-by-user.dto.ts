// Basado en: { status, userId }: { status: string; userId: string }




export class ReadTasksByUserDto {

    constructor(
        public readonly userId: string
    ) {
    }

    static create(props: { [key: string]: any }): [string?, ReadTasksByUserDto?] {
        const { userId } = props;

        if (!userId || typeof userId !== 'string') {
            return ['UserId is required and must be a string'];
        }

        return [undefined, new ReadTasksByUserDto(userId.trim())];
    }
}