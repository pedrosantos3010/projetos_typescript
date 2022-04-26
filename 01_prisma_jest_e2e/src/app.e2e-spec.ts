import { prisma } from "./prisma";
import request from "supertest";

import { app } from "./app";

test("[e2e] CreateLesson", async () => {
  const response = await request(app)
    .post("/lessons")
    .send({ title: "Nova aula" });

  const lessonInDatabase = await prisma.lesson.findFirst({
    where: {
      title: "Nova Aula",
    },
  });

  expect(response.status).toBe(201);
  expect(response.body.error).toBeFalsy();
  expect(lessonInDatabase).toBeTruthy();
});
