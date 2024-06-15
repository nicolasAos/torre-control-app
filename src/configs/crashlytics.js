global.CRASHLYTICS = (textError) => {
    firebase.crashlytics().log(textError);
}

global.CRASHLYTICS_RECORD_ERROR = (code, message) => {
    firebase.crashlytics().recordError(code, message);
}