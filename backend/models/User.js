const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not'],
    required: [true, 'Gender is required']
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed', ''],
    default: ''
  },
  occupation: {
    type: String,
    trim: true
  },
  
  // Health Information
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood type is required']
  },
  height: {
    type: Number,
    min: 0,
    required: [true, 'Height is required']
  },
  weight: {
    type: Number,
    min: 0,
    required: [true, 'Weight is required']
  },
  allergies: {
    type: String,
    trim: true,
    default: ''
  },
  medicalConditions: {
    type: String,
    trim: true,
    default: ''
  },
  insuranceProvider: {
    type: String,
    trim: true
  },
  insuranceNumber: {
    type: String,
    trim: true
  },
  smokingStatus: {
    type: String,
    enum: ['never', 'former', 'current', ''],
    default: ''
  },
  alcoholConsumption: {
    type: String,
    enum: ['none', 'occasional', 'moderate', 'heavy', ''],
    default: ''
  },
  exerciseFrequency: {
    type: String,
    enum: ['none', 'rare', 'moderate', 'regular', 'daily', ''],
    default: ''
  },
  familyHistory: {
    type: String,
    trim: true
  },
  
  // Emergency Contact
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true
    }
  },
  
  // System Information
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    default: 'patient'
  },
  patientId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    accessibility: {
      textSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      voiceAssist: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      dataCollection: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ patientId: 1 });

module.exports = mongoose.model('User', userSchema);
