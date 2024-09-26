module.exports = {
  apps: [
    {
      name: 'api-server',
      script: 'npm',
      args: 'run dev',
      cwd: 'apps/api',
      env: {
        NODE_ENV: 'development',
        DATABASE_URL: 'mysql://lunoeven:AlphaThap42%40%40cendrawasih.kencang.com:3306/lunoeven_hallo'
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL: 'mysql://lunoeven:AlphaThap42%40%40cendrawasih.kencang.com:3306/lunoeven_hallo'
      }
    }, 
    { 
      name: 'web-server',
      script: 'npm',
      args: 'run dev',
      cwd: 'apps/web',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
