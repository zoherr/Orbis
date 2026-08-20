export const toPublicMeeting = (meeting) => {
    return {
        _id : meeting._id,
        title: meeting.title,
        code: meeting.meetingCode,
        date: meeting.meetingDate,
        time: meeting.meetingTime
    }
}