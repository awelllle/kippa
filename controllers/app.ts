import { Request, Response } from "express";
import { default as utils }from '../utils'
import { Course, CourseInterface } from '../models/course';
import { Lesson } from '../models/lesson';
import axios from "axios";


export class AppController { 
public async createCourse(req: Request & {user: any}, res: Response) {

  const required = [
    { name: 'id', type: 'string' },
    { name: 'intro', type: 'string' },
    { name: 'name', type: 'string' },

  ]
  const { body } = req;
  const hasRequired = utils.helpers.validParam(body, required)

  if (hasRequired.success) {
    
    let courseId: string = body.id
        const filter = { 
          courseId 
      };

      const update = {
          intro: body.intro,
          name: body.name
      };
      let ress =  await Course.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      rawResult: true // Return the raw result from the MongoDB driver
      });


     // console.log(ress.lastErrorObject.updatedExisting, 'ggg')

     if(ress.lastErrorObject.updatedExisting){

      return utils.helpers.sendSuccessResponse(
        res,
        [],
        'Course has been updated',
        )

      }else{

        return utils.helpers.sendSuccessResponse(
          res,
          [],
          'Course has been created',
          )
      }
      
  
  }else{

    console.log(hasRequired.message)
    const message = hasRequired.message
    return utils.helpers.sendErrorResponse(
    res,
    { message },
    'Missing required fields',
    )

  }
}


public async createLesson(req: Request & {user: any}, res: Response) {

  const required = [
    { name: 'courseId', type: 'string' },
    { name: 'title', type: 'string' },
   
  ]
  const { body } = req;
  const hasRequired = utils.helpers.validParam(body, required)

  if (hasRequired.success) {
    
    let courseId: string = body.courseId;
    let lessonId: string = body.lessonId;

        const filter = { 
          courseId,
          lessonId
      };

      const update = {
        title: body.title,
        courseId: courseId,
        lessonId: lessonId
      };


      let ress =  await Lesson.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      rawResult: true //Return the raw result from the MongoDB driver
      });


     // console.log(ress.lastErrorObject.updatedExisting, 'ggg')

     if(ress.lastErrorObject.updatedExisting){

      return utils.helpers.sendSuccessResponse(
        res,
        [],
        'Lesson has been updated',
        )

      }else{

        return utils.helpers.sendSuccessResponse(
          res,
          [],
          'Lesson has been created',
          )
      }
      
  
  }else{

    console.log(hasRequired.message)
    const message = hasRequired.message
    return utils.helpers.sendErrorResponse(
    res,
    { message },
    'Missing required fields',
    )

  }
}



public async webhook(req: Request, res: Response) {
  try {
    const token = process.env.WHATSAPP_TOKEN;
    // Check the Incoming webhook message
    // console.log(JSON.stringify(req.body, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body =
          req.body.entry[0].changes[0].value.messages[0].text.body.trim(); // extract the message text from the webhook payload
        //get the profile of the user who sent the whatsapp messahe
        
        let message;

       
        await axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v15.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: message },
            preview_url: true,
          },
          headers: { "Content-Type": "application/json" },
        });
        // console.log(whatsapp.data)
        // res.send(message)
      }

      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.data);
    res.send(error);
  }
}



}