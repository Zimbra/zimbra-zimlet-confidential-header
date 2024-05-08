import { useDispatch, useSelector, batch } from 'react-redux';
import { useCallback, useEffect } from 'preact/hooks';
import { useText } from 'preact-i18n';
import { gql } from '@apollo/client';
import { withIntl } from '../enhancers';
import { zimletEventEmitter } from '@zimbra-client/util';
import { useSendMessageMutation, usePreferences } from '@zimbra-client/hooks';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';
import { getMenuClicked } from '../store/selectors';
import { updateMenuClicked } from '../store/actions';

const prefsQuery = gql`
	query GetPrefEditingDetails {
		getPreferences {
			zimbraPrefMessageViewHtmlPreferred
		}
	}
`;

const SendCustomHeaderMessage = ({ notify, closeComposer, getMessageToSend }) => {
	const dispatch = useDispatch();
	const isOffline = useSelector(state => state.network.isOffline);
	const MenuClicked = useSelector(state => getMenuClicked(state));
	const { data } = usePreferences(prefsQuery, { fetchPolicy: 'cache-only' });
	const zimbraPrefMessageViewHtmlPreferred =
		data?.getPreferences?.zimbraPrefMessageViewHtmlPreferred;
	const sendMessageMutation = useSendMessageMutation({
		zimbraPrefMessageViewHtmlPreferred,
		isOffline
	});

	const { messageSent, sendFail } = useText({
		messageSent: 'zimbra-zimlet-confidential-header.messageSent',
		sendFail: 'zimbra-zimlet-confidential-header.sendFail'
	});

	const onSendHeaderHandler = useCallback(
		({ onAfterSend }) => {
			const customHeaders = [
				{ name: 'Sensitivity', _content: MenuClicked }
			];
			const messageToSend = getMessageToSend();
			if (MenuClicked.length > 0) {
				messageToSend.header = customHeaders;
			}

			sendMessageMutation({ message: messageToSend, zimbraPrefMessageViewHtmlPreferred })
				.then(() => {
					!isOffline && closeComposer && closeComposer();
					onAfterSend && onAfterSend(true);
					batch(() => {
						dispatch(
							notify({
								message: messageSent
							})
						);
						dispatch(updateMenuClicked(false));
					});
				})
				.catch(err => {
               console.log(err);
					onAfterSend && onAfterSend(false);
					dispatch(
						notify({
							message: sendFail
						})
					);
				});
		},
		[
			MenuClicked,
			closeComposer,
			dispatch,
			getMessageToSend,
			isOffline,
			notify,
			sendFail,
			sendMessageMutation,
			messageSent,
			zimbraPrefMessageViewHtmlPreferred
		]
	);

	useEffect(() => {
		zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.ONSEND, onSendHeaderHandler, true);
		return () => {
			zimletEventEmitter.off(ZIMBRA_ZIMLET_EVENTS.ONSEND, onSendHeaderHandler);
		};
	}, [dispatch, onSendHeaderHandler]);

	return null;
};

export default withIntl()(SendCustomHeaderMessage);
