import { Schema, model, Error, Document } from 'mongoose';

export interface CourseInterface extends Document {
  name: string;
  intro: string;
  courseId: string,
  

}


export const CourseSchema = new Schema<CourseInterface>(
  {
    intro: String,
    name: String,
    courseId: String,
  },
 
);

export const Course = model('Course', CourseSchema)
