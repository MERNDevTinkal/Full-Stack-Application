export const welcomeEmailHTML = (username: string) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:30px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; padding:40px; border-radius:8px; font-family: Arial, sans-serif;">
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <h1 style="color:#2196F3;">Welcome to TrueFeedback!</h1>
          </td>
        </tr>
        <tr>
          <td style="font-size:16px; color:#555;">
            <p>Hi <strong>${username}</strong>,</p>
            <p>Congratulations! Your email has been successfully verified.</p>
            <p>Start using our platform and enjoy seamless experience!</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:30px;">
            <a href="https://yourapp.com/login" style="background-color:#2196F3; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:5px; font-weight:bold;">Login Now</a>
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
