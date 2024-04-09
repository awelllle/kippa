import { Schema, model, Error, Document } from 'mongoose';

interface sections {
  content: Array<string>;
  
}


const sections = new Schema<sections>(
  {
    content: Array,
  },
);


export interface LessonInterface extends Document {
  courseId: string;
  lessonId: string;
  title: string;
  sections: [sections];
  closingRemarks: string;
}


export const LessonSchema = new Schema<LessonInterface>(
  {
    courseId: String,
    lessonId: String,
    title: String,
    closingRemarks: String,
    sections: {
      type: [sections],
    },
  },
 
);

export const Lesson = model('Lesson', LessonSchema)
