import { prisma } from "../../prisma";
import { CreateLessonData, LessonsRepository } from "../LessonsRepository";

export class PrismaLessonsRepository implements LessonsRepository {
  public async create(data: CreateLessonData): Promise<void> {
    await prisma.lesson.create({
      data,
    });
  }
}
