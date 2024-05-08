import { createElement } from 'preact';
import { withIntl } from '../../enhancers';
import { ModalDialog } from '@zimbra-client/components';

const ConfidentialHeaderDialog = ({ onClose, onAction, context, zimletStrings }) => {
   return (
      <ModalDialog
         title={zimletStrings.sensitivityBtn}
         cancelButton={false}
         onAction={onAction}
         onClose={onClose}
         actionLabel="buttons.ok"
      >
         <p>{zimletStrings.sensitivityDialog}<br /><br />
            <select id="ConfHeaderZimletsensitivity">
               <option value="Company-Confidential">{zimletStrings.sensitivityOptionConfidential}</option>
               <option value="Personal">{zimletStrings.sensitivityOptionPersonal}</option>
               <option value="Private">{zimletStrings.sensitivityOptionPrivate}</option> <option value=""></option>
            </select>
         </p>
      </ModalDialog>
   );
};

export default withIntl()(ConfidentialHeaderDialog);
