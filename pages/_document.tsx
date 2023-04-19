// pages/_document.tsx

// Import necessary dependencies
import { Html, Head, Main, NextScript } from "next/document";

// Custom Document component for the Next.js application
export default function Document() {
  return (
    // Set the HTML lang attribute to "en" for English
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
