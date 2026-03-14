import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // If you have authentication set up, you can link this to the User model later
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    filename: { 
      type: String, 
      required: true 
    },
    originalName: { 
      type: String 
    },
    uploadType: { 
      type: String, 
      enum: ['pdf', 'text'], 
      required: true 
    },
    textContent: { 
      type: String // To store the raw text if they pasted text instead of a PDF
    },
    status: { 
      type: String, 
      enum: ['processing', 'completed', 'failed'], 
      default: 'processing' 
    },
    // This empty object will eventually store the detailed JSON risk scores from Flask
    analysisResults: { 
      type: Object, 
      default: null 
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt dates!
);

export default mongoose.model("Document", documentSchema);