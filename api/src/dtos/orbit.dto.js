export const toPublicOrbit = (orbit) => {
    return {
        _id: orbit._id,
        title: orbit.title,
        code: orbit.orbitCode,
        date: orbit.orbitDate,
        time: orbit.orbitTime,
        type: orbit.type,
        ...(orbit.joinTime && {
            joinTime: orbit.joinTime
        })
    };
};