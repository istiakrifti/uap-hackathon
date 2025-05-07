import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  courses: {
    title: string;
    description: string;
    resources: string[];
  }[];
  quiz: {
    question: string;
    options: string[];
    correctOption: number;
  }[];
  requirements: string[];
  status: 'active' | 'inactive';
  isPaid: boolean;
  paymentAmount?: number;
  currency?: string;
  jobOpportunity: boolean;
  jobDetails?: {
    position?: string;
    location?: string;
    jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
    salary?: string;
    requirements?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the courses within a project
const CourseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  resources: {
    type: [String],
    default: [],
  },
});

// Schema for quiz questions
const QuizSchema = new Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: [(val: string[]) => val.length >= 2, 'At least 2 options are required'],
  },
  correctOption: {
    type: Number,
    required: [true, 'Correct option is required'],
  },
});

// Schema for job details
const JobDetailsSchema = new Schema({
  position: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
  },
  salary: {
    type: String,
    trim: true,
  },
  requirements: {
    type: [String],
    default: [],
  },
});

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Company ID is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    courses: {
      type: [CourseSchema],
      default: [],
    },
    quiz: {
      type: [QuizSchema],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentAmount: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    jobOpportunity: {
      type: Boolean,
      default: false,
    },
    jobDetails: {
      type: JobDetailsSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema); 