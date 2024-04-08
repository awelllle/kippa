import { Request, Response } from "express";
import { AppRoutes } from "./app";
export class Routes {
  public appRoutes: AppRoutes = new AppRoutes();

  public routes(app): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "APIs are up and running!",
      });
    });


    this.appRoutes.routes(app);
    
  }
}