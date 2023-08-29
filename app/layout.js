import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Discord Bot Dashboard",
  description:
    "Open source and free to use discord bot dashboard. (you must give credit to the original creator)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
