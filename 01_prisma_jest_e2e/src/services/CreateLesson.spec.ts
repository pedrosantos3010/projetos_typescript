import { InMemoryLessonsRepository } from "../test/repositories/InMemoryLessonsRepository";
import { CreateLesson, CreateLessonRequest } from "./CreateLesson";

describe("Create Lesson", () => {
    it("should throw error when title is not defined", async () => {
        const createLesson = new CreateLesson({
            create: async (data) => {},
        });

        const createLessonRequest = <CreateLessonRequest>{};
        await expect(createLesson.execute(createLessonRequest)).rejects.toThrow(
            new Error("Title is required.")
        );
    });

    it("should create data when title is set", async () => {
        const inMemoryLessonsRepository = new InMemoryLessonsRepository();
        const createLesson = new CreateLesson(inMemoryLessonsRepository);

        const createLessonRequest: CreateLessonRequest = { title: "Nova aula" };
        await createLesson.execute(createLessonRequest);

        expect(inMemoryLessonsRepository.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Nova aula",
                }),
            ])
        );
    });
});
