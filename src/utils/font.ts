import localFont from 'next/font/local';

const nexaHeavy = localFont({
    src: [
        {
            path: "../fonts/nexa/nexa.woff",
            style: "normal",
        }
    ],
    variable: "--font-nexa"
});

export default nexaHeavy;
