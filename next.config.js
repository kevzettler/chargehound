const withSass = require('@zeit/next-sass')
module.exports = Object.assign({},
                               withSass(),
                               {
                                 distDir: 'dist/.next'
                               }
);
