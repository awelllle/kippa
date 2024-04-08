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


public async verifyToken(req: Request, res: Response) {
  try {
    const token = process.env.VERIFY_TOKEN;
    console.log(req.query)
    if (
      req.query["hub.mode"] == "subscribe" &&
      req.query["hub.verify_token"] == token
    ) {
      console.log("webhook connected");
      res.send(req.query["hub.challenge"]);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
  }
}

public async webhook(req: Request, res: Response) {
  try {
    const token = process.env.TOKEN;
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
        

        if(req.body.entry[0].changes[0].value.messages[0].interactive){
        
        var buttonReplyId = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
        var buttonReplyTitle = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.title 


        let response;
        switch (buttonReplyTitle) {
        case 'Course Intro':

          Course.findOne(
            { courseId: buttonReplyId },
            async (err: Error, course) => {
              if (err) {

                console.log(err, 'course intro err')
                
              }

              const intro = course.intro
              const btnId = buttonReplyId;
              const btnTitle = 'Section 1';
              return utils.helpers.sendMessageResponse(phone_number_id, from, token, intro, btnId, btnTitle)
      
              
            }
          );
          break;

          case 'Section 1':
          
          const lessId = `${buttonReplyId}L1`
          Lesson.findOne(
            { lessonId: lessId, courseId: buttonReplyId },
            async (err: Error, lesson) => {
              if (err) {
                return utils.helpers.sendErrorResponse(
                  res,
                  {},
                  "Something went wrong, please try again"
                );
              }

              console.log(lesson.sections, 'less')
              const intro = `${lesson.sections[0]}`
              const btnId = buttonReplyId;
              const btnTitle = 'Lesson 1';

              return utils.helpers.sendMessageResponse(phone_number_id, from, token, intro, btnId, btnTitle)
      
              
            }
          );
          break;










        default:
            response = "Unknown button clicked";
       }










        }else{

          await axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v15.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "interactive",
              interactive: {
                "type": "button",
                "body": {
                  "text": "Welcome to this Course titled: Understanding Global Warming: Causes, Impacts, and Solutions. Please click continue to begin"
                },
                "action": {
                  "buttons": [
                    {
                      "type": "reply",
                      "reply": {
                        "id": "CO1234",
                        "title": "Course Intro"
                      }
                    }
                  ]
                }
              }
            },
            headers: { "Content-Type": "application/json" },
          });

        }

        

       

       
        
        // console.log(whatsapp.data)
        // res.send(message)
      }

      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error, 'kk');
    res.send(error);
  }
}



}