import type { Request, Response } from "express";

export class CategoryController {
  //   constructor() {}

  async create(req: Request, res: Response) {
    return res.json({ message: "create category" });
  }
}
