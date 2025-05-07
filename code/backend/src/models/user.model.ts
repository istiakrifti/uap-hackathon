import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'job_seeker' | 'industry';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
  position?: string;
  experience?: string;
  skills?: string[];
  industry?: string;
  bio?: string;
  education?: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }[];
  workExperience?: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }[];
  certificates?: {
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialUrl?: string;
  }[];
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  preferredJobTypes?: string[];
  preferredLocations?: string[];
  paymentMethods?: {
    type: 'bank' | 'paypal' | 'stripe' | 'other';
    details: Record<string, any>;
    isDefault: boolean;
  }[];
  notificationPreferences?: {
    email: boolean;
    newProjects: boolean;
    projectUpdates: boolean;
    payments: boolean;
    jobOpportunities: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const EducationSchema = new Schema({
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  field: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
});

const WorkExperienceSchema = new Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
});

const CertificateSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  issuer: {
    type: String,
    required: true,
    trim: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  credentialUrl: {
    type: String,
  },
});

const PaymentMethodSchema = new Schema({
  type: {
    type: String,
    enum: ['bank', 'paypal', 'stripe', 'other'],
    required: true,
  },
  details: {
    type: Object,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const NotificationPreferencesSchema = new Schema({
  email: {
    type: Boolean,
    default: true,
  },
  newProjects: {
    type: Boolean,
    default: true,
  },
  projectUpdates: {
    type: Boolean,
    default: true,
  },
  payments: {
    type: Boolean,
    default: true,
  },
  jobOpportunities: {
    type: Boolean,
    default: true,
  },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password in queries
    },
    role: {
      type: String,
      enum: ['job_seeker', 'industry'],
      default: 'job_seeker',
    },
    company: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
    },
    industry: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    workExperience: {
      type: [WorkExperienceSchema],
      default: [],
    },
    certificates: {
      type: [CertificateSchema],
      default: [],
    },
    linkedInUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    portfolioUrl: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    preferredJobTypes: {
      type: [String],
    },
    preferredLocations: {
      type: [String],
    },
    paymentMethods: {
      type: [PaymentMethodSchema],
      default: [],
    },
    notificationPreferences: {
      type: NotificationPreferencesSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 