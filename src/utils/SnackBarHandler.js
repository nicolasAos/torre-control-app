import Snackbar from 'react-native-snackbar'

export default class SnackBarHandler {
	static error(msg) {
		Snackbar.show({
			title: msg,
			duration: Snackbar.LENGTH_LONG,
			backgroundColor: 'red'
		})
	}

	static success(msg) {
		Snackbar.show({
			title: msg,
			duration: Snackbar.LENGTH_LONG,
			backgroundColor: 'green'
		})
	}
}
