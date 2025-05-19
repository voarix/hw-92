import mongoose, { HydratedDocument, Model } from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UserFields } from "../../types";

interface UserMethods {
  checkPassword: (password: string) => Promise<boolean>;
  generateToken(): void;
}

interface UserVirtuals {
  confirmPassword: string;
}

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

export const generateTokenJWT = (user: HydratedDocument<UserFields>) => {
  return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "365d" });
};

export const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret";

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new mongoose.Schema<
  HydratedDocument<UserFields>,
  UserModel,
  UserMethods,
  {},
  UserVirtuals
>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (value: string): Promise<boolean> {
          if (!this.isModified("username")) return true;
          const user: HydratedDocument<UserFields> | null = await User.findOne({
            username: value,
          });
          return !user;
        },
        message: "This username is already taken",
      },
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    virtuals: {
      confirmPassword: {
        get() {
          return this.__confirmPassword;
        },
        set(confirmPassword: string) {
          this.__confirmPassword = confirmPassword;
        },
      },
    },
  },
);

UserSchema.methods.checkPassword = async function (password: string) {
  return await argon2.verify(this.password, password);
};

UserSchema.methods.generateToken = function () {
  this.token = generateTokenJWT(this);
};

UserSchema.path("password").validate(async function (v: string) {
  if (!this.isModified("password")) return;

  if (v !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Passwords do not match");
    this.invalidate("password", "Passwords do not match");
  }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
  next();
});

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
