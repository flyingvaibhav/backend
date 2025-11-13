class ApiError extends Error {
    constructor(
        satusCode,
        message="Something went wrong",
errors=[],
stack=""
    
    ) {
        super(message);
        this.status = satusCode;
        this.data=null;
        this.message=message;
        this.sucess=false;
        this.error=errors;

        if (stack) {
            this.stack=stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };