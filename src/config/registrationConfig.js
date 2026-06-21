export const REGISTRATION_CLOSED_USER_MESSAGE =
  'As inscrições da COMEJACA foram encerradas. Em caso de dúvidas, entre em contato com a organização.';

export const REGISTRATION = {
  closed: process.env.REACT_APP_REGISTRATION_CLOSED === 'true',
  closedUserMessage: REGISTRATION_CLOSED_USER_MESSAGE,
  closedButtonLabel: 'Inscrições Encerradas',
};

export default REGISTRATION;
