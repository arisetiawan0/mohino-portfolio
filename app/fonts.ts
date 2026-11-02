import { Archivo, Courier_Prime } from "next/font/google";
import localFont from "next/font/local";

// Archivo variable: wdth 62-125, wght 100-900.
// Headline pakai lebar sempit (papan harga), body lebar normal.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

// Cetakan termal: struk, simulator, kode.
export const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-courier",
});

// Layar pelanggan 14-segmen. OFL 1.1, lihat app/fonts/DSEG-LICENSE.txt.
export const dseg = localFont({
  src: "./fonts/DSEG14Classic-Regular.woff2",
  display: "swap",
  variable: "--font-dseg",
  preload: false,
});

export const fontVars = `${archivo.variable} ${courier.variable} ${dseg.variable}`;
