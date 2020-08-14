var services = {
    getDevice: function (width, height) {
        return (height / width) < 0.6 ? 'Phone' : height < 770 || width < 530 ? 'Phone' : 'Tablet';
    }
};
export { services as default };
// {"metadata":{"lastSignInTime":1597069944426,
// "creationTime":1596869068525},
// "phoneNumber":null,
// "displayName":"Venkateswarlu Madala",
// "isAnonymous":false,
// "providerData":[{"email":"venkateswarlu.madala@ymail.com",
// "phoneNumber":null,
// "uid":"1384269328388885",
// "photoURL":"https://graph.facebook.com/1384269328388885/picture",
// "displayName":"Venkateswarlu Madala","providerId":"facebook.com"}],
// "email":"venkateswarlu.madala@ymail.com",
// "emailVerified":false,
// "providerId":"firebase",
// "photoURL":"https://graph.facebook.com/1384269328388885/picture",
// "uid":"IXhL4S5igOPlD6GPy3JKIv5YHJs2"}