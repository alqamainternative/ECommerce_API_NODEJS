
const UserErrorHandler = (error) => {
    const myError = { ...error, status: 400 };
    if(error.keyPattern && error.keyPattern.email == 1){
        myError['message'] = "Email already registered";
    }
    else if(error.message.includes("email")){
        myError['message'] = "Please Provide a valid Email Address"
    }
    else if(error.message.includes("password")){
        // error.message = error.message.split("password: ")[1]
        myError['message'] = error.message.split("password: ").slice(-1)[0]
    }
    else if(error.message.includes("age")){
        // error.message = error.message.split("password: ")[1]
        myError['message'] = error.message.split("age: ").slice(-1)[0]
    }
    else {
        myError.status = 500;
    }
    return myError;
}

const ProductErrorHandler = (error) => {
    return error;
}

const OrderErrorHandler = (error) => {
    const myError = { ...error, status: 400 };
    if(error.errors && error.errors.quantity && error.errors.quantity.message){
        myError.message = error.errors.quantity.message
    }
    else if(error.errors && error.errors.product && error.errors.product.message && error.errors.product.message.includes("ObjectId"))
    {
        myError.message = "Invalid Product ID"
    }
    else{
        myError.status = 500;
    }
    return myError;
}


const CategoryErrorHandler = (error) => {
    if(error.message.includes("name")){
        error.message = "Category name is required";
    }
    return error;
}


module.exports = { UserErrorHandler, ProductErrorHandler, CategoryErrorHandler, OrderErrorHandler};