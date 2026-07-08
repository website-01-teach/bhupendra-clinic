export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.status(200).json({
    status: 'healthy',
    service: 'Bhupendra Clinic API',
    timestamp: new Date().toISOString()
  });
}
