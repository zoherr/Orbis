export function ValidateSchema(Schema) {
    return (req, res, next) => {
        const result = Schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors
            });
        }
        req.body = result.data;
        next();
    }
}