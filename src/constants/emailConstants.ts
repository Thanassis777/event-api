const EmailConstants = {
    RESET_PASSWORD_SUBJECT: 'Password Reset',
    RESET_PASSWORD_BODY_TEMPLATE: `
        <p>Hello <strong>[recipient]</strong>,</p>

        <p>You requested that your Event App password be reset.</p>

        <p>
            Click on the link below to create your new password:
            <a href="[reset_link]/[token]">Reset Password</a>
        <p>

        <p>
            For security purposes, this link will expire in 
            <strong>[expires_in]</strong> or after you reset 
            your password.
        </p>

        <p>
            For further information please conduct us at address@event.com
        </p>

        <p>
            Sincerely,
            <br/>
            The Event App team.
        </p>

    `,
};

export default EmailConstants;