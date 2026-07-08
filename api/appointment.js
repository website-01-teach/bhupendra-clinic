export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, email, phone, serviceInterest, message } = req.body;

    // Validation
    if (!fullName || !email || !phone || !serviceInterest) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    // Prepare Telegram message
    const serviceMap = {
      'weight-loss': 'Weight Loss',
      'weight-gain': 'Weight Gain',
      'cancer-diet': 'Cancer Diet Plan',
      'diabetes': 'Diabetes Management',
      'other': 'Other'
    };

    const serviceName = serviceMap[serviceInterest] || serviceInterest;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const telegramMessage = `🆕 *New Appointment Request*

👤 *Name:* ${fullName}
📧 *Email:* ${email}
📱 *Phone:* ${phone}
💊 *Service:* ${serviceName}
⏰ *Time:* ${timestamp}

📝 *Message:*
${message || 'No message provided'}

📞 Please contact within 24 hours.
    `.trim();

    // Send Telegram notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    let telegramSent = false;
    let telegramError = null;

    if (botToken && chatId) {
      try {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
          })
        });

        if (telegramResponse.ok) {
          telegramSent = true;
        } else {
          const errorData = await telegramResponse.text();
          telegramError = errorData;
        }
      } catch (err) {
        telegramError = err.message;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment request submitted successfully',
      telegramNotification: telegramSent,
      telegramError: telegramError,
      submittedAt: timestamp
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
