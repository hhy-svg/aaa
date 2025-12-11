import constant from "../constant.js";
const {
    STRING
} = constant;

class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = STRING.CUSTOM_ERROR;
    }
}
export default CustomError;