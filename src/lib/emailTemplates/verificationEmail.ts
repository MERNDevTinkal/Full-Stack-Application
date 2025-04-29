export const verificationEmailHTML = (username: string, verifyCode: string) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:30px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; padding:40px; border-radius:8px; font-family: Arial, sans-serif;">
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <h1 style="color:#333;">TrueFeedback</h1>
          </td>
        </tr>
        <tr>
          <td style="font-size:16px; color:#555;">
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for signing up! Please use the verification code below:</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 0;">
            <div style="display:inline-block; background-color:#4CAF50; color:white; padding:15px 30px; border-radius:5px; font-size:24px; font-weight:bold;">
              ${verifyCode}
            </div>
          </td>
        </tr>
        <tr>
          <td style="font-size:14px; color:#777; padding-top:20px;">
            <p>This code will expire in 1 hour.</p>
            <p>If you did not request, ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:40px; font-size:12px; color:#aaa;">
            <p>&copy; ${new Date().getFullYear()} TrueFeedback. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
