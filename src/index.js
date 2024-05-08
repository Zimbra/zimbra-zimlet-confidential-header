import { createElement } from 'preact';
import SendCustomHeaderMessage from './components/send-custom-header-message';
import reducers from './store/reducer';
import * as actionCreators from './store/actions';
import * as selectors from './store/selectors';
import CreateMore from './components/more';
import CreateDisplay from './components/display';
import { provide } from 'preact-context-provider';

export default function Zimlet(context) {
	const {
		plugins,
		zimletRedux: {
			actions: {
				notifications: { notify }
			}
		}
	} = context;
	const exports = {};
	const reduxNamespace = 'ConfidentialHeaderZimlet';

	exports.init = function init() {
		plugins.register('slot::message-body-top', provide(context)(CreateDisplay));
		plugins.register('slot::compose-sender-options-menu', <CreateMore context={context} />);
		plugins.register('slot::mail-composer-toolbar-send', ({ closeComposer, getMessageToSend }) => (
			<SendCustomHeaderMessage
				notify={notify}
				closeComposer={closeComposer}
				getMessageToSend={getMessageToSend}
			/>
		));
		context.zimletRedux.injectAsyncReducer(reduxNamespace, reducers);
		context.zimletRedux.addActions(reduxNamespace, actionCreators);
		context.zimletRedux.addSelectors(reduxNamespace, selectors);
	};

	exports.destroy = function destroy() {
		context.zimletRedux.removeActions(reduxNamespace);
		context.zimletRedux.removeSelectors(reduxNamespace);
	};

	return exports;
}
