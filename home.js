// // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// // SPDX-License-Identifier: Apache-2.0

// import Tabs from './Components/Tabs/Tabs';

// /*eslint-disable*/
// function parseJwt (token) {
//     var base64Url = token.split('.')[1];
//     var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return JSON.parse(jsonPayload);
// }

// const HomePage = () => {
//   var idToken = parseJwt(sessionStorage.idToken.toString());
//   var accessToken = parseJwt(sessionStorage.accessToken.toString());
//   console.log ("Amazon Cognito ID token encoded: " + sessionStorage.idToken.toString());
//   console.log ("Amazon Cognito ID token decoded: ");
//   console.log ( idToken );
//   console.log(idToken['cognito:username'])
//   sessionStorage.setItem('cognitoId', idToken['cognito:username'])
//   console.log ("Amazon Cognito access token encoded: " + sessionStorage.accessToken.toString());
//   console.log ("Amazon Cognito access token decoded: ");
//   console.log ( accessToken );
//   console.log ("Amazon Cognito refresh token: ");
//   console.log ( sessionStorage.refreshToken );
//   console.log ("Amazon Cognito example application. Not for use in production applications.");
// /*eslint-enable*/

//   return (
//     <div>
//       <Tabs/>
//     </div>
//   );
// };

// export default HomePage;
