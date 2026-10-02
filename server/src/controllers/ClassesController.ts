import { Request, Response } from "express";

import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: "Missing filters to search classes",
      });
    }

    const timeInMinutes = convertHourToMinutes(time);

    // JOIN com class_schedule: retorna 1 linha para cada horário da aula
    const rows = await db("classes")
      .whereExists(function () {
        this.select("*")
          .from("class_schedule")
          .whereRaw("class_schedule.class_id = classes.id")
          .where("class_schedule.week_day", Number(week_day))
          .where("class_schedule.from", "<=", timeInMinutes)
          .where("class_schedule.to", ">", timeInMinutes);
      })
      .where("classes.subject", subject)
      .join("coaches", "classes.coach_id", "coaches.id")
      .join("class_schedule as cs", "cs.class_id", "classes.id")
      .select(
        "classes.id as class_id",
        "classes.subject",
        "classes.cost",
        "coaches.id",
        "coaches.name",
        "coaches.avatar",
        "coaches.whatsapp",
        "coaches.bio",
        "cs.week_day",
        "cs.from",
        "cs.to",
      )
      .orderBy(["classes.id", "cs.week_day", "cs.from"]);

    // Agrupa as linhas por aula, montando o array "schedule" de cada coach
    const grouped = new Map<number, any>();

    for (const row of rows) {
      const { week_day, from, to, ...coach } = row;

      if (!grouped.has(coach.class_id)) {
        grouped.set(coach.class_id, { ...coach, schedule: [] });
      }

      grouped.get(coach.class_id).schedule.push({ week_day, from, to });
    }

    return response.json(Array.from(grouped.values()));
  }

  async create(request: Request, response: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } =
      request.body;

    const trx = await db.transaction();

    try {
      const insertedCoachesIds = await trx("coaches").insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
      const coach_id = insertedCoachesIds[0];

      const insertedClassesIds = await trx("classes").insert({
        subject,
        cost,
        coach_id,
      });
      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      await trx("class_schedule").insert(classSchedule);
      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response.status(400).json({
        error: "Unexpected error while creating new class",
      });
    }
  }
}
