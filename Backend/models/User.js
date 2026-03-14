import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: function () {
      return this.provider === "local"
    },
    trim: true
  },


  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  profilePicture: {
    type: String
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  password: {
    type: String,
    required: function () {
     return this.provider === "local"
   }
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  plan: {
    type: String,
    enum: ["Starter", "Growth", "Enterprise"],
    default: "Starter"
  }

})

export default mongoose.model("User", userSchema)