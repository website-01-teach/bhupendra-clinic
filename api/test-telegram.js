export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({
      error: 'Environment variables not set',
      botTokenSet: !!botToken,
      chatIdSet: !!chatId
    });
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🚀 *Test Message from Bhupendra Clinic*\n\nIf you receive this, Telegram integration is working! ✅',
        parse_mode: 'Markdown'
      })
    });

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Test message sent to Telegram'
      });
    } else {
      const errorData = await response.text();
      return res.status(500).json({
        error: 'Failed to send test message',
        details: errorData
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Exception occurred',
      message: error.message
    });
  }
}
