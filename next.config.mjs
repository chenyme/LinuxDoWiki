import nextra from 'nextra'
 
// Set up Nextra with its configuration
const withNextra = nextra({
  contentDirBasePath: '/docs'
})
 
// Export the final Next.js config with Nextra included
export default withNextra({
  allowedDevOrigins: [
    'test.chenyme.com'
  ],
  
  // 配置图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'linux.do',
        pathname: '/**',
      },
    ],
  }
})