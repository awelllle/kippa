import { AppController } from '../controllers/app';
//import {authenticate} from '../utils/middleware/authenticate';

export class AppRoutes {
    public appController: AppController = new AppController();

   
    public routes(app): void {
      
        app.route('/course').post([], this.appController.createCourse)
        app.route('/lesson').post([], this.appController.createLesson)
     

        app.route('/for/messages/from/whatsapp').post(this.appController.webhook)
       
        
    }
}