export const checkEnvVariables = (): void => {
  if (!process.env.NEXT_PUBLIC_APP_ID) {
    throw new Error(
      "NEXT_PUBLIC_APP_ID environment variable is missing or empty. Please head to https://apps.openformat.tech/ to create your app."
    );
  }
};
