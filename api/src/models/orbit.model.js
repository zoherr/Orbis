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

const orbitSchema = new mongoose.Schema({
    title: {
        require: true,
        type: String
    },
    orbitDate: {
        type: Date,
        required: true
    },
    orbitTime: {
        type: String,
        required: true
    },
    orbitCode: {
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


const OrbitModel = mongoose.model("Orbit", orbitSchema);

export default OrbitModel;