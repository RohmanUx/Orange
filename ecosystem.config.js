module.exports = {
    apps: [
      {
        name: 'app',
        script: './app.js',
        env: {
          NODE_ENV: 'development',
          DATABASE_URL: 'mysql://lunoeven:AlphaThap42%40%40cendrawasih.kencang.com:3306/lunoeven_hallo'
        },
        env_production: {
          NODE_ENV: 'production',
          DATABASE_URL: 'mysql://lunoeven:AlphaThap42%40%40cendrawasih.kencang.com:3306/lunoeven_hallo'
        }
      }
    ]
  };
  