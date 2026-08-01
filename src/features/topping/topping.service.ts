import { ToppingModel } from "./topping.model.js";
import type { Topping } from "./types.js";

export class ToppingService {
  async createTopping(topping: Topping) {
    return await ToppingModel.create(topping);
  }

  async getAllToppings({
    pageNumber = 1,
    limitNumber = 10,
  }: {
    pageNumber: number;
    limitNumber: number;
  }) {
    const skip = (pageNumber - 1) * limitNumber;
    const [toppings, count] = await Promise.all([
      ToppingModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
      ToppingModel.countDocuments(),
    ]);
    return { toppings, count };
  }

  async getTopping(id: string) {
    return await ToppingModel.findById(id);
  }

  async updateTopping(id: string, data: Partial<Topping>) {
    return await ToppingModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteTopping(id: string) {
    return await ToppingModel.findByIdAndDelete(id);
  }
}
