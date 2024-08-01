const baseTemp = (image: string, heading: string, body: string): any => {
  return `
    <div>
      <img src="${image}" alt="image"/>
      <h1>${heading}</h1>
      ${body}
    </div>
  `;
};

export const OrderProgressTemplate = (
  id: any,
  type: string,
  productName: string,
  usd: number | undefined,
  naira: number,
  status: string,
  reason: string,
): any => {
  const image =
    'https://res.cloudinary.com/hilory/image/upload/v1611017566/work/webmail.png';
  const heading = `<span style="text-transform: capitalize;">${productName} </span> ${
    type === 'coin' ? '' : type
  } sale ${status === 'declined' ? ' declined' : 'approved'}`;
  const body = `
        <div style="text-align: center;line-height: 28px;">
            ${
              status === 'declined'
                ? 'Unfortantely, your amazon card sale order was declined. The summary below contains reasons why your order was declined. Thank you for choosing us.'
                : 'Congratulations chairman, your order has been approved, your wallet wil credited in a few moment. Thank you for choosing  us, Cheers to good life 🥂🎉.'
            }
            <h3 style="margin-top: 50px;">Transaction Summary</h3>
            <table style="margin-top: 30px;width:100%;text-align: left;border-collapse: collapse;max-width:100%;">
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Order ID</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;word-break: break-word;"> 
                        ${id}
                    </td>
                </tr>
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Product Name</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;text-transform: capitalize;">${productName}</td>
                </tr>
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Value (USD)</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;text-transform: capitalize;">USD ${usd}</td>
                </tr>
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Expected Return (NGN)</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;text-transform: capitalize;">NGN ${naira}</td>
                </tr>
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Order Status</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;text-transform: capitalize;color:#ffc107; font-weight:500;">${status}</td>
                </tr>

                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Reason</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;word-break: break-word;">${reason}</td>
                </tr>
            </table>
        </div>
        
    `;
  return baseTemp(image, heading, body);
};

export const WalletCreditTemplate = (
  id: any,
  amount: number,
  productName: string,
  usd: number | undefined,
  naira: number,
): any => {
  const image =
    'https://res.cloudinary.com/hilory/image/upload/v1611017566/work/webmail.png';
  const heading = `Wallet Credited 🤑`;
  const body = `
        <div style="text-align: center;line-height: 28px;">
            Congratulations chairman, your wallet has been credited with ${amount}, you can proceed to withdraw your fund whenever you see fit.. Thank you for choosing  us, Cheers to good life 🥂🎉.
            <h3 style="margin-top: 50px;">Transaction Summary</h3>
            <table style="margin-top: 30px;width:100%;text-align: left;border-collapse: collapse;max-width:100%;">
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Order ID</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;word-break: break-word;"> 
                        ${id}
                    </td>
                </tr>
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Product Name</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;text-transform: capitalize;">${productName}</td>
                </tr>
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Value (USD)</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;text-transform: capitalize;">USD ${usd}</td>
                </tr>
                <tr style="border: 1px solid #1b1c1d;">
                    <th style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;">Expected Return (NGN)</th>
                    <td style="border: 1px solid #1b1c1d; padding:10px 20px;width:100px;text-transform: capitalize;">NGN ${naira}</td>
                </tr>
            
            </table>
        </div>
        
    `;
  return baseTemp(image, heading, body);
};
