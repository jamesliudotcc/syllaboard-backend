import * as Mailgun from 'mailgun-js';

export async function sendEmail(emailInfo: {
  email: string;
  cohortKey: string;
}) {
  const apiKey = process.env.MAILGUN_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const mailgun = new Mailgun({ apiKey, domain });
  const fromWho = 'Syllaboard Robot<robot@jamesliu.cc>';
  const cohortKey = emailInfo.cohortKey;
  const userEmail = emailInfo.email;
  const link = `http://syllaboard.herokuapp.com/signin/${cohortKey}/`;
  const email = {
    from: fromWho,
    to: userEmail,
    subject: 'Welcome to Syllaboard',
    html: `You have been invited to Syllabard, General Assembly's assignment tracking service. Click <a href="${link}">here</a> to sign up.`,
  };
  try {
    const mailGunResponse = await mailgun.messages().send(email);
    return mailGunResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
}
