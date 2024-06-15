import {
    formatedPicker,
    formatedRegions,
    formatedPickerVehicleTypes,
    formatedPickerOccurrenceTypes,
    formatedPickerOwners,
    formatedPickerVehicles,
    formatedPickerTracker,
    formatedPickerjourneysOfOperatorPicker,
    formatedPickerSACReportTypes,
} from '../configs/utils';

// Login
export const motoIdSelector = (state) =>
    state.login && state.login.content && state.login.content.moto_id ?
    state.login.content.moto_id :
    null;
export const loginSelector = (state) =>
    state.login && state.login.content ? state.login.content : {};
export const loginHomologSelector = (state) =>
    state.loginHomolog && state.loginHomolog.content ?
    state.loginHomolog.content :
    false;
export const driverSelector = (state) =>
    state.forgot && state.forgot.content && state.forgot.content.motorista ?
    state.forgot.content.motorista :
    {};
export const mailSelector = (state) =>
    state.forgot && state.forgot.content && state.forgot.content.mail ?
    state.forgot.content.mail :
    {};
export const isTravelSelector = (state) =>
    state.isTravel && state.isTravel.content ? state.isTravel.content : false;

//Location
export const latlongSelector = (state) =>
    state.location &&
    state.location.content &&
    state.location.content.latitude &&
    state.location.content.longitude ?
    state.location.content.latitude + ', ' + state.location.content.longitude :
    '';
export const locationSelector = (state) =>
    state.location && state.location.content ? state.location.content : {};

//User Id OneSignal - device id
export const deviceIdSelector = (state) =>
    state.deviceId && state.deviceId.content ? state.deviceId.content : '';

//FreightPreferences
export const freightPreferencesSelector = (state) =>
    state.freightPreferences && state.freightPreferences.content ?
    state.freightPreferences.content :
    {};
//FreightWish
export const freightWishSelector = (state) =>
    state.freightWish && state.freightWish.content ?
    state.freightWish.content :
    [];
//Calcultion ETA
export const etaCalculationSelector = (state) =>
    state.etaCalculation && state.etaCalculation.content ?
    state.etaCalculation.content :
    [];

// CNH
export const cnhSelector = (state) =>
    state.cnh && state.cnh.content ? state.cnh.content : {};
// vehicles
export const vehiclesSelector = (state, isFormated) =>
    state.vehicles && state.vehicles.content ?
    formatedPickerVehicles(state.vehicles.content, isFormated) :
    [];
// truckBodies
export const truckBodiesSelector = (state, isFormated) =>
    state.truckBodies && state.truckBodies.content ?
    formatedPickerVehicles(state.truckBodies.content, isFormated) :
    [];

// Cnhs Types
export const cnhTypesSelector = (state, isFormated) =>
    state.cnhTypes && state.cnhTypes.content ?
    formatedPicker(state.cnhTypes.content, isFormated) :
    [];
// Fuel Types
export const fuelTypesSelector = (state, isFormated) =>
    state.fuelTypes && state.fuelTypes.content ?
    formatedPicker(state.fuelTypes.content, isFormated) :
    [];
// Truck Body Types
export const truckBodyTypesSelector = (state, isFormated) =>
    state.truckBodyTypes && state.truckBodyTypes.content ?
    formatedPicker(state.truckBodyTypes.content, isFormated) :
    [];
// Vehicle Types
export const vehicleTypesSelector = (state, isFormated) =>
    state.vehicleTypes && state.vehicleTypes.content ?
    formatedPickerVehicleTypes(state.vehicleTypes.content, isFormated) :
    [];
// Tracker Types
export const trackerTypesSelector = (state, isFormated) =>
    state.trackerTypes && state.trackerTypes.content ?
    formatedPickerTracker(state.trackerTypes.content, isFormated) :
    [];
// Regions Types
export const regionsSelector = (state, isFormated) =>
    state.regions && state.regions.content ?
    formatedRegions(state.regions.content, isFormated) :
    [];
// SAC Report Types
export const sacReportTypesSelector = (state, isFormated) =>
    state.sacReportTypes && state.sacReportTypes.content ?
    formatedPickerSACReportTypes(state.sacReportTypes.content, isFormated) :
    [];
// Occurrence Types
export const occurrenceTypesSelector = (state, isFormated) =>
    state.occurrenceTypes && state.occurrenceTypes.content ?
    formatedPickerOccurrenceTypes(state.occurrenceTypes.content, isFormated) :
    [];
// Occurrenced Notes
export const occurrencedNotesSelector = (state, isFormated) => {
    return state.occurrencedNotes && state.occurrencedNotes.content ?
        state.occurrencedNotes.content :
        [];
};
// Owner Selector
export const ownerSelector = (state, isFormated) =>
    state.ownersVehicles && state.ownersVehicles.content ?
    formatedPickerOwners(state.ownersVehicles.content, isFormated) :
    [];
// Responsible Freight
export const responsibleFreightSelector = (state) =>
    state.responsibleFreight && state.responsibleFreight.content ?
    state.responsibleFreight.content :
    {};
// Status Monitoring
export const statusMonitoringSelector = (state, isFormated) =>
    state.statusMonitoring && state.statusMonitoring.content ?
    formatedPicker(state.statusMonitoring.content, isFormated) :
    [];
// Status Reason Monitoring
export const statusReasonMonitoringSelector = (state, isFormated) =>
    state.statusReasonMonitoring && state.statusReasonMonitoring.content ?
    formatedPicker(state.statusReasonMonitoring.content, isFormated) :
    [];
// Push Preventive Monitoring
export const pushPreventiveMonitoringSelector = (state) =>
    state.pushPreventiveMonitoring && state.pushPreventiveMonitoring.content ?
    state.pushPreventiveMonitoring.content :
    {};

/* Shipping Companies / Transportadora  */
export const shippingCompaniesSelector = (state) =>
    state.shippingCompanies && state.shippingCompanies.data ?
    state.shippingCompanies.data :
    [];
export const shippingCompanieSelector = (state) =>
    state.shippingCompanies && state.shippingCompanies.selected ?
    state.shippingCompanies.selected :
    null;

//Get driver's journey
export const journeysOfOperatorTypesSelector = (data) => formatedPickerjourneysOfOperatorPicker(data)