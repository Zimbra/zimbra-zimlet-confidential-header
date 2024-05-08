import { createElement } from 'preact';
import { useContext, useCallback, useRef, useEffect } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { IntlContext } from 'preact-i18n';
import { withIntl } from '../../enhancers';
import { compose } from 'recompose';
import style from './style';

function CreateDisplay(props, context) {
	const { intl } = useContext(IntlContext);
	const zimletStrings = intl.dictionary['zimbra-zimlet-confidential-header'];
	const { zimbraBatchClient } = context;

	const headerRef = useRef(null); // Create a reference for the header element

	useEffect(() => {
		zimbraBatchClient.jsonRequest({
			name: 'GetMsg',
			namespace: "urn:zimbraMail",
			body: {
				m: { id: props.emailData.id, header: [{ n: "Sensitivity" }] }
			}
		})
			.then(response => {
				if (response.m && response.m[0] && response.m[0]._attrs && response.m[0]._attrs['Sensitivity']) {
					const header = response.m[0]._attrs['Sensitivity'].replace(/\n|\r/g, "");
					let headerDisplay = "";
					switch (header) {
						case 'Company-Confidential':
							headerDisplay = zimletStrings.CompanyConfidential;
							break;
						case 'Personal':
							headerDisplay = zimletStrings.Personal;
							break;
						case 'Private':
							headerDisplay = zimletStrings.Private;
							break;
					}

					if (headerRef.current) {
						headerRef.current.innerText = '🤐 ' + headerDisplay;
					}
				}
			})
			.catch(error => {
				console.error(error);
			});
	}, [props.emailData.id]);

	return (
		<div class={style.ConfidentialHeaderZimlet} ref={headerRef}></div>
	);
}

export default compose(withIntl())(CreateDisplay);
