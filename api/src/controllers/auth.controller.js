import { checkUserExist, optVeified, sendOtp } from "../services/auth.service.js";



export const initiateAuth = async (req, res, next) => {
    try {

        const { email } = req.body;

        const isExist = await checkUserExist(email);

        if (!isExist) {
            const activationToken = await sendOtp(email);

            res.json({
                success: true,
                message: "OTP Sent Successfully!",
                activationToken: activationToken,
                isExistingUser: false
            })
        }

        res.json({
            success: true,
            message: "User Found Successfully!",
            isExistingUser: true
        })
    } catch (error) {
        next(error);
    }
}
export const userRegister = async (req, res, next) => {
    try {

        const { fullName, email, password, username, otp, activationToken } = req.body;

        const isOtpCorrect = await optVeified(email, otp, activationToken);

        if (!optVeified) {
            res.json({
                success: false,
                message: "Wrong OTP!"
            })
        }

        res.json({
            success: true,
            message: "User Register Successfully!"
        })
    } catch (error) {
        next(error);
    }
}

export const userLogin = async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "User Login Successfully!"
        })
    } catch (error) {
        next(error);
    }
}