/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './features/**/*.{js,ts,jsx,tsx,mdx}',  // 👈 bạn đang để code ở đây
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: { extend: {} },
    plugins: [],
};
