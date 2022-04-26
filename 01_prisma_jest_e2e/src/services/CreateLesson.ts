import { LessonsRepository } from "../repositories/LessonsRepository";

export interface CreateLessonRequest {
  title: string;
  description?: string;
}

export class CreateLesson {
  public constructor(private lessonsRepository: LessonsRepository) {}

  public async execute({
    title,
    description,
  }: CreateLessonRequest): Promise<void> {
    if (!title) {
      throw new Error("Title is required.");
    }

    await this.lessonsRepository.create({ title, description });
  }
}
