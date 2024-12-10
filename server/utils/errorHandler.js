export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  }
}

export function handleError(error, res) {
  console.error('❌ Error:', error);

  // SQLite unique constraint error
  if (error.message?.includes('UNIQUE constraint failed')) {
    return res.status(400).json({
      error: 'A record with these details already exists',
      details: error.message,
      status: 'fail'
    });
  }

  // SQLite constraint error
  if (error.message?.includes('CHECK constraint failed')) {
    return res.status(400).json({
      error: 'The data does not meet the required constraints',
      details: error.message,
      status: 'fail'
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
      status: error.status
    });
  }

  // Default error
  return res.status(500).json({
    error: 'An unexpected error occurred',
    details: error.message,
    status: 'error'
  });
}