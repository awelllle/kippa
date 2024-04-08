import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 1000, //1 second in milliseconds
  max: 1,
  message: "You have exceeded the 3 requests in 1 second limit!", 
  standardHeaders: true,
  legacyHeaders: false,
});

export {rateLimiter};
