export const toPublicUser = (user) => ({
    fullName: user?.fullName,
    email: user?.email,
    username: user?.username,
});
