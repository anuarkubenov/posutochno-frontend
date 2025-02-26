import withLess from 'next-with-less';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withLess({
  ...nextConfig,
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
});
