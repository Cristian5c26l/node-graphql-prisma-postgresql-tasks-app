export class CreateTaskDto {
  private constructor(
    public readonly title: string,
    public readonly userId: string,
    public readonly status: string, // Optional, can be set later
    // public readonly columnId?: string, // Optional, can be set later
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateTaskDto?] {
    const { title, status, userId } = props;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return ['Title is required and must be a non-empty string'];
    }

    

    if (!userId || typeof userId !== 'string') {
      return ['UserId is required and must be a string'];
    }

    

    if (status && typeof status !== 'string') {
      return ['Status must be a string if provided'];
    }

    return [undefined, new CreateTaskDto(title.trim(), userId.trim(), status.trim())];
  }
}
