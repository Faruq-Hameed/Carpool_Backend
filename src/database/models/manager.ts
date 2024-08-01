import mongoose, { Schema, type Document, type CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

//  JobTitle enum
enum JobTitle {
  Admin = 'admin',
  Manager = 'manager',
  Frontend = 'frontend',
  Backend = 'backend',
}

enum PagePermission {
  Granted = 'granted',
  New_Manager = 'new_manager',
}

// interface for the Manager document
interface IManager extends Document {
  username: string;
  email: string;
  phonenumber: string;
  password: string;
  firstname: string;
  lastname: string;
  job_title: JobTitle;
  is_active: boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  page_permission: string[];
}

// Mongoose schema for the Manager
const ManagerSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    job_title: {
      type: String,
      enum: JobTitle,
      required: true,
    },
    page_permission: {
      type: String,
      enum: PagePermission,
      required: true,
      default: PagePermission.New_Manager,
    },
  },
  { timestamps: true },
);

// Middleware to hash password before saving
ManagerSchema.pre<IManager>(
  'save',
  async function (next: (err?: CallbackError) => void) {
    if (!this.isModified('password')) {
      next();
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  },
);

// Method to compare passwords
ManagerSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password as string);
};

// ManagerSchema.plugin(mongoosePaginate);

// Create the Mongoose model for the Manager
const Manager = mongoose.model<IManager>('managers', ManagerSchema);

export { Manager, type IManager, JobTitle };
