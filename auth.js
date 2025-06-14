// // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// // SPDX-License-Identifier: Apache-2.0

// import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
// // import config from "./config.json";
// const config = {
//     "region": process.env.REACT_APP_REGION,
//     "userPoolId": process.env.REACT_APP_USER_POOL_ID,
//     "clientId": process.env.REACT_APP_CLIENT_ID
// }

// export const cognitoClient = new CognitoIdentityProviderClient({
//   region: config.region,
// });

// export const signIn = async (username, password) => {
//   const params = {
//     AuthFlow: "USER_PASSWORD_AUTH",
//     ClientId: config.clientId,
//     AuthParameters: {
//       USERNAME: username,
//       PASSWORD: password,
//     },
//   };
//   try {
//     const command = new InitiateAuthCommand(params);
//     const { AuthenticationResult } = await cognitoClient.send(command);
//     if (AuthenticationResult) {
//       sessionStorage.setItem("idToken", AuthenticationResult.IdToken || '');
//       sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || '');
//       sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || '');
//       sessionStorage.setItem("userName", username || '');
//       const jwt = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//       })

//       const jwtData = await jwt.json();
//       sessionStorage.setItem("token", jwtData.accessToken);
//       return AuthenticationResult;
//     }
//   } catch (error) {
//     console.error("Error signing in: ", error);
//     throw error;
//   }
// };

// export const signUp = async (email, password, name, phone) => {
//   const params = {
//     ClientId: config.clientId,
//     Username: email,
//     Password: password,
//     UserAttributes: [
//       {
//         Name: "email",
//         Value: email,
//       },
//       {
//         Name: "name",
//         Value: name
//       },
//       {
//         Name: "phone_number",
//         Value: phone
//       }
//     ],
//   };
//   try {
//     const command = new SignUpCommand(params);
//     const response = await cognitoClient.send(command);
//     console.log("Sign up success: ", response);
//     console.log(response.UserSub);
//     fetch(`${process.env.REACT_APP_SERVER_URL}/createUser`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ email, name, phone, cognitoId: response.UserSub, tokens: 0, usedTokens: 0})
//         })
//             .then(response => response.json())
//             .then(data => {
//                 // Handle the response data here
//             })
//             .catch(error => {
//                 // Handle any errors here
//             });
//     return response;
//   } catch (error) {
//     console.error("Error signing up: ", error);
//     throw error;
//   }
// };

// export const confirmSignUp = async (username, code) => {
//   const params = {
//     ClientId: config.clientId,
//     Username: username,
//     ConfirmationCode: code,
//   };
//   try {
//     const command = new ConfirmSignUpCommand(params);
//     await cognitoClient.send(command);
//     console.log("User confirmed successfully");
//     return true;
//   } catch (error) {
//     console.error("Error confirming sign up: ", error);
//     throw error;
//   }
// };
