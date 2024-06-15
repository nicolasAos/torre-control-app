import { combineReducers } from 'redux'
import { homeReducer as home } from './homeReducer'
import {
    locationReducer as location,
    deviceIdReducer as deviceId,
    isTravelReducer as isTravel
} from './homeReducer'
import {
    loginReducer as login,
    forgotReducer as forgot,
    loginHomologReducer as loginHomolog
} from './loginReducer'
import cnh from './cnhReducer'
import fuelTypes from './fuelTypesReducer'
import vehicleTypes from './vehicleTypesReducer'
import truckBodyTypes from './truckBodyTypesReducer'
import freightPreferences from './freightPreferencesReducer'
import freightWish from './freightWishReducer'
import truckBodies from './truckBodiesReducer'
import cnhTypes from './cnhTypesReducer'
import vehicles from './vehiclesReducer'
import shippingCompanies from './shippingCompaniesReducer'
import regions from './regionsReducer'
import statusMonitoring from './statusMonitoringReducer'
import statusReasonMonitoring from './statusReasonMonitoringReducer'
import trackerTypes from './trackerTypesReducer'
import occurrenceTypes from './occurrenceTypesReducer'
import occurrenceTypesGo from './occurrenceTypesGoReducer'
import ownersVehicles from './onwerReducer'
import responsibleFreight from './responsibleFreight'
import pushPreventiveMonitoring from './pushReducer'
import occurrencedNotes from './occurrencedNotesReducer'
import jorneyOfOperator from './journeyOfOperatorReducer'
import jorneyOfOperatorType from './journeysOfOperatorTypesReducers'
import etaCalculation from './etaCalculation'
import currentTrip from './currentTripReducer'
import sacReportTypes from './sacReportTypesReducer'

const rootReducer = combineReducers({
    login,
    loginHomolog,
    home,
    isTravel,
    forgot,
    location,
    deviceId,
    cnh,
    freightPreferences,
    freightWish,
    truckBodies,
    vehicles,
    shippingCompanies,
    fuelTypes,
    cnhTypes,
    vehicleTypes,
    truckBodyTypes,
    regions,
    statusMonitoring,
    statusReasonMonitoring,
    trackerTypes,
    occurrenceTypes,
    ownersVehicles,
    responsibleFreight,
    occurrenceTypesGo,
    pushPreventiveMonitoring,
    occurrencedNotes,
    jorneyOfOperatorType,
    jorneyOfOperator,
    etaCalculation,
    currentTrip,
    sacReportTypes,
})

export default rootReducer;