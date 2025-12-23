import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  output: 'standalone', // 开启独立运行模式，极大节省生产环境体积
};

export default nextConfig;
