const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { generateToken } = require("../service/authentication");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageURL: {
      type: String,
      default: "/images/default-profile.png",
    },
    salt: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  user.salt = salt;
  user.password = hashedPassword;
  next();
});

userSchema.static("findById", async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not FOund");
  const hashedPassword = user.password;
  const salt = user.salt;
  const providedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (hashedPassword !== providedPassword)
    throw new Error("password is incorrect");
  const token = generateToken(user);
  return token;
});

const User = model("user", userSchema);
module.exports = User;
