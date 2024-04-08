import { Schema, model, Error, Document } from 'mongoose';

interface sections {
  content: string;
  
}


const sections = new Schema<sections>(
  {
    content: String,
  },
);


export interface LessonInterface extends Document {
  courseId: string;
  lessonId: string;
  title: string;
  sections: sections[];
}


export const LessonSchema = new Schema<LessonInterface>(
  {
    courseId: String,
    lessonId: String,
    title: String,
    sections: {
      type: [sections],
    },
  },
 
);

export const Lesson = model('Lesson', LessonSchema)
