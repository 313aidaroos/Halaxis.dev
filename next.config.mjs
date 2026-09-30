/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Apixis ID callback errors land on /login?error=… (shared SDK); Halaxis's sign-in page is /auth/login.
  async redirects() {
    return [{ source: "/login", destination: "/auth/login", permanent: false }];
  },
};

export default nextConfig;
