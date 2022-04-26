import {
  CreateLessonData,
  LessonsRepository,
} from "../../repositories/LessonsRepository";
import { Lesson } from "@prisma/client";
import crypto from "node:crypto";

export class InMemoryLessonsRepository implements LessonsRepository {
  public items: Lesson[] = [];

  public async create(data: CreateLessonData): Promise<void> {
    this.items.push({
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || null,
    });
  }
}
