// import the jwt library
import jwt from 'jsonwebtoken';

// Function to create a JWT token and save it in a cookie
const createTokenAndSaveCookie=(userId, res)=>{

    // 1. we get userId nd res from the function parameters


   //  1. Create a JWT token with the userId
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "10d"
        }

    )
    // 2. Set the token in a cookie

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite:'strict'

    })

    return token;

}

export default createTokenAndSaveCookie;


// steps for jwt token creation and saving in cookie
// 1. import jwt library
// 2. create a function that takes userId and res as parameters
// 3. create a token using jwt.sign() with userId and secret key
// 4. set the token in a cookie using res.cookie() it takes cookie name, token, and other options
// 5. return the token
