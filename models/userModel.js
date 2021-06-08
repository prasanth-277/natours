const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell your name"],
  },
  email: {
    type: String,
    required: [true, "Please tell your email"],
    unique: true,
    lowerCase: true,
  },
  profilePic: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please tell your password"],
    minLength: 8,
    unique: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      //this works only on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//runs before save() and create()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimestamp);

    return JWTTimestamp < this.changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log('---------',resetToken,this.passwordResetExpires)
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
