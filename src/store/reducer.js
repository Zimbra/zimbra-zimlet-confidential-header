import { handleActions } from 'redux-actions';
import * as actionCreators from './actions';

const initialState = {
	MenuClicked: false
};

export default handleActions(
	{
		[actionCreators.updateMenuClicked]: (state, action) => ({
			...state,
			MenuClicked: action.payload
		})
	},
	initialState
);
