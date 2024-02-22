import mongoose, { Document, model, Query, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

import { commonSchemaHooks } from '../middlewares/commonSchemaHooks';
import { CustomQuery } from '../constants/definitions';

import { IShopSchema } from './shopModel';
import Shop from './shopModel';
import User from './userModel';

export enum UserTypes {
  owner = 'owner',
  client = 'client',
}

export interface IUserSchema extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  passwordConfirm: string;
  resetPasswordToken: string;
  phone: number;
  mobile: string;
  email: string;
  userType: string;
  active: boolean;
  comment: string;
  createdAt: Date;
  updatedAt: Date;

  correctPassword: (candidatePass: string, userPass: string) => Promise<boolean>;

  shops: IShopSchema[];
}

const userSchema = new Schema<IUserSchema>({
  firstName: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 20,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
    },
  },
  lastName: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 20,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
    },
  },
  username: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 20,
    validate: {
      validator: (value: string) => validator.isAlphanumeric(value),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: (value: string) => validator.isStrongPassword(value),
      message: 'Password should be strong { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1',
    },
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return value === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  phone: {
    type: Number,
    min: 10,
    max: 10,
  },
  mobile: {
    type: String,
    minlength: 10,
    maxlength: 10,
    required: false,
    validate: {
      validator: (value: string) => validator.isMobilePhone(value, 'el-GR'),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
    },
  },
  active: {
    type: Boolean,
    required: false,
  },
  comment: {
    type: String,
    minlength: 1,
    maxlength: 200,
  },
  userType: {
    type: String,
    required: true,
    enum: Object.values(UserTypes),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  shops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
  ],
});

userSchema.pre<Query<IUserSchema[], IUserSchema>>(/^find/, function (next) {
  this.populate({ path: 'shops', select: '-updatedAt -createdAt' });

  next();
});

// remove sensitive data from user object
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.methods.correctPassword = async (candidatePass: string, userPass: string) =>
  await bcrypt.compare(candidatePass, userPass);

commonSchemaHooks(userSchema);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      this.passwordConfirm = undefined;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.pre<CustomQuery<IUserSchema>>('findOneAndDelete', async function (next) {
  const userId = this._conditions._id;
  const user = await User.findById(userId);

  // Get the IDs of shops connected to this user
  const shopIds = user.shops.map((shop) => shop.id);

  // Remove shops referred to specific user
  await Shop.deleteMany({ _id: { $in: shopIds } });
  next();
});

export default model<IUserSchema>('User', userSchema);
