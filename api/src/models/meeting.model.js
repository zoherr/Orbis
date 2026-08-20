import mongoose from 'mongoose';


const attendeesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    joinTime: {
        type: Date,
        default: Date.now
    }
});

const meetingSchema = new mongoose.Schema({
    title: {
        require: true,
        type: String
    },
    meetingDate: {
        type: Date,
        required: true
    },
    meetingTime: {
        type: String,
        required: true
    },
    meetingCode: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    attendees: [attendeesSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});


const MeetingModel = mongoose.model("Meeting", meetingSchema);

export default MeetingModel;