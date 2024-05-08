import { createElement } from 'preact';
import { useContext, useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { Text, IntlContext } from 'preact-i18n';
import { ActionMenuItem } from '@zimbra-client/components';
import { withIntl } from '../../enhancers';
import { updateMenuClicked } from '../../store/actions';
import ConfidentialHeaderDialog from './modal';
import { callWith } from '@zimbra-client/util';

const CreateMore = ({ context }) => {
	const dispatch = useDispatch();
	const { intl } = useContext(IntlContext);
	const zimletStrings = intl.dictionary['zimbra-zimlet-confidential-header'];

	const showModalHandler = useCallback(() => {
		showModal(context, zimletStrings)
	}, [context, zimletStrings]);

	const setConfidentiality = useCallback(() => {
		dispatch(updateMenuClicked(window.parent.document.getElementById('ConfHeaderZimletsensitivity').value));
		dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'ConfidentialHeaderDialog' }));
	}, [dispatch]);

	//implements closing of the dialog
	function removeModal(context) {
		dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'ConfidentialHeaderDialog' }));
	}

	function showModal(context, zimletStrings) {
		const modal = (
			<ConfidentialHeaderDialog
				onClose={callWith(removeModal, context)}
				onAction={callWith(setConfidentiality, context)}
				context={context}
				zimletStrings={zimletStrings}
			/>
		);
		const { dispatch } = context.store;
		dispatch(context.zimletRedux.actions.zimlets.addModal({ id: 'ConfidentialHeaderDialog', modal: modal }));
	}

	return (
		<ActionMenuItem onClick={showModalHandler}>🤐 <Text id="zimbra-zimlet-confidential-header.sensitivityBtn" />
		</ActionMenuItem>
	);
};

export default withIntl()(CreateMore);
