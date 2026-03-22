interface EnvShape {
  PORT?: string;
  NODE_ENV?: string;
  MONGO_URI?: string;
  CLIENT_URL?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

export const validateEnv = (): void => {
  const env = process.env as EnvShape;
  const required: Array<keyof EnvShape> = [
    'MONGO_URI',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
