import { type Document, type PaginateModel, Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { StudentAmbassadorStatus } from '@/utils/types';

interface IStudentAmbassador extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  institution: string;
  level: number;
  social_media: string[];
  institution_state: string;
  position: string;
  communities: string;
  events_managed: number;
  why_ambassador: string;
  initiative: string;
  cover_letter: object[];
  status: StudentAmbassadorStatus;
}

const StudentAmbassadorSchema: Schema<IStudentAmbassador> =
  new Schema<IStudentAmbassador>(
    {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
      },
      institution: {
        type: String,
        required: true,
      },
      level: {
        type: Number,
        required: true,
      },
      social_media: {
        type: [String],
        required: true,
        default: [],
      },
      institution_state: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        required: true,
      },
      communities: {
        type: String,
        required: true,
      },
      events_managed: {
        type: Number,
        required: true,
      },
      why_ambassador: {
        type: String,
        required: true,
      },
      initiative: {
        type: String,
        required: true,
      },
      cover_letter: {
        type: [Object],
      },
      status: {
        type: String,
        default: StudentAmbassadorStatus.pending,
        lowercase: true,
        enum: Object.values(StudentAmbassadorStatus),
      },
    },
    { timestamps: true },
  );

StudentAmbassadorSchema.plugin(paginate);

const StudentAmbassador = model<
  IStudentAmbassador,
  PaginateModel<IStudentAmbassador>
>('student_ambassador', StudentAmbassadorSchema);

export { type IStudentAmbassador, StudentAmbassador };
