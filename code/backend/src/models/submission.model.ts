import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  quizResults: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  quizScore: number;
  quizPassed: boolean;
  projectLink: string;
  githubLink?: string;
  zipFileUrl?: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  feedback?: string;
  // Payment related fields
  isPaid: boolean;
  paymentAmount?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentDate?: Date;
  paymentMethod?: {
    type: 'bank_transfer' | 'mobile_banking' | 'paypal' | 'stripe' | 'other';
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    mobileNumber?: string;
    provider?: string;
    transactionId?: string;
    additionalInfo?: string;
  };
  // Job application related fields
  isJobApplication: boolean;
  applicationStatus?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  interviewDate?: Date;
  interviewNotes?: string;
  resume?: string;
  coverLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuizResultSchema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  selectedOption: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const PaymentMethodSchema = new Schema({
  type: {
    type: String,
    enum: ['bank_transfer', 'mobile_banking', 'paypal', 'stripe', 'other'],
    required: true,
  },
  accountNumber: {
    type: String,
  },
  accountName: {
    type: String,
  },
  bankName: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  provider: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  additionalInfo: {
    type: String,
  }
});

const SubmissionSchema = new Schema<ISubmission>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    quizResults: {
      type: [QuizResultSchema],
      default: [],
    },
    quizScore: {
      type: Number,
      default: 0,
    },
    quizPassed: {
      type: Boolean,
      default: false,
    },
    projectLink: {
      type: String,
      default: '',
    },
    githubLink: {
      type: String,
    },
    zipFileUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'rejected'],
      default: 'pending',
    },
    feedback: {
      type: String,
    },
    // Payment related fields
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: PaymentMethodSchema,
    },
    // Job application related fields
    isJobApplication: {
      type: Boolean,
      default: false,
    },
    applicationStatus: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    },
    interviewDate: {
      type: Date,
    },
    interviewNotes: {
      type: String,
    },
    resume: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubmission>('Submission', SubmissionSchema); 