declare module 'next-with-less' {
    import { NextConfig } from 'next';
    const withLess: (config: NextConfig) => NextConfig;
    export default withLess;
  }
  