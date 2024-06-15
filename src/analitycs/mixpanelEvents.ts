/**
 * Time tracking events
 */
enum _TimeTrackingEvents {
  // When the user taps a button in the landing screen
  first_tap = 'First Tap',
}

/**
 * Call to Actions events
 */
enum CTAEvents {
  btn_get_started_tapped = 'Btn Get Started Td',
  btn_i_have_account_tapped = 'Btn I Have Account Td',
}

/**
 * Overall app events
 */
enum AppEvents {
  app_open = 'App Open',
  home_screen_visited = 'Home Screen Visited',
  last_mille_visited = 'Remittances Screen Visited',
  recogidas_visited = 'Recogidas y Entregas Screen Visited',
  error_boundary_catched = 'Error Boundary did catch',
  send_catched_requests = 'Send Catched Request',
  spreadSheet_screen_visited = 'SpreadSheet Screen Visited',
  start_travel = 'Start Travel',
  cTes_screen_visited = 'CTes Screen Visited',
  start_trip = 'Start Trip',
  'Invoices Screen Visited' = 'Invoices Screen Visited',
  'Low Screen Visited' = 'Low Screen Visited',
  'Ocurrence Screen Visited' = 'Ocurrence Screen Visited',
  'Send Location Prime Successful' = 'Send Location Prime Successful',
  'Send Location Prime Failed' = 'Send Location Prime Failed',
  'Send Location Prime No device_id' = 'Send Location Prime No device_id',
  'Send Location Prime' = 'Send Location Prime',
  'Start Background Task' = 'Start Background Task',
  'Stop Background Task' = 'Stop Background Task',
  'ACCESS FINE LOCATION' = 'ACCESS FINE LOCATION',
  'ACCESS BACKGROUND LOCATION' = 'ACCESS BACKGROUND LOCATION',
  'Colectas Screen Visited' = 'Colectas Screen Visited',
  // location
  location_requested_successfully = 'Location Requested Successfully',
  location_requested_failed = 'Location Requested Failed',
}

/**
 * User properties
 */
enum _UserProperties {
  some_property = 'Some Property',
}

/**
 * All events
 */
type _MixpanelEvents = _TimeTrackingEvents | AppEvents | CTAEvents;

export type MixpanelEvents = `${_MixpanelEvents}`;
export type MixpanelTimeTrackingEvents = `${_TimeTrackingEvents}`;
export type MixpanelUserProperties = `${_UserProperties}`;
