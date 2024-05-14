(function(window) {

    window["env"] = window["env"] || {};

    // Environment variables
    window['env']['environmentName'] = '${ENVIRONMENT_NAME}';
    window['env']['appBaseUrl'] = '${APP_BASE_URL}';
    window['env']['qrCodeBasePath'] = '${QR_CODE_BASE_PATH}';
    window['env']['relativeFileUploadUrl'] = '${RELATIVE_FILE_UPLOAD_URL}';
    window['env']['relativeFileUploadUrlManualType'] = '${RELATIVE_FILE_UPLOAD_URL_MANUAL_TYPE}';
    window['env']['relativeImageUploadUrl'] = '${RELATIVE_IMAGE_UPLOAD_URL}';
    window['env']['relativeImageUploadUrlAllSizes'] = '${RELATIVE_IMAGE_UPLOAD_URL_ALL_SIZES}'
    window['env']['googleMapsApiKey'] = '${GOOGLE_MAPS_API_KEY}';
    window['env']['tokenForPublicLogRoute'] = '${TOKEN_FOR_PUBLIC_LOG_ROUTE}';
    window['env']['mapboxAccessToken'] = '${MAPBOX_ACCESS_TOKEN}';

    // Environment variables for Beyco integration
    window['env']['beycoAuthURL'] = '${BEYCO_AUTH_URL}'
    window['env']['beycoClientId'] = '${BEYCO_CLIENT_ID}'

})(this);
