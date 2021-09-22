// const EncodePlugin = require("webpack-encode-plugin");
var Agent = require("agentkeepalive");

module.exports = {
  transpileDependencies: [/node_modules[/\\\\]vuetify[/\\\\]/],
  pluginOptions: {
    enableInSFC: true
  },

  devServer: {
    proxy: {
      "^/ords": {
        target: "http://iis.ufa.tn.corp",
        changeOrigin: true,
        agent: new Agent({
          maxSockets: 100,
          keepAlive: true,
          maxFreeSockets: 20,
          keepAliveMsecs: 100000,
          timeout: 1000000,
          freeSocketTimeout: 90000
        }),
        onProxyRes: proxyRes => {
          var key = "www-authenticate";
          proxyRes.headers[key] = proxyRes.headers[key] && proxyRes.headers[key].split(",");
        },
        onProxyReq: proxyReq => {
          if (proxyReq.getHeader("origin")) {
            proxyReq.setHeader("origin", "http://iis.ufa.tn.corp");
          }
        }
      }
    }
  },

  publicPath: process.env.NODE_ENV === "production" ? "/projects/employee_quiz/dist/" : "",
  outputDir: "dist/",

  configureWebpack: {
    output: {
      filename: "[name].js",
      chunkFilename: "[name].js"
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      },
      extensions: ["*", ".js", ".vue", ".json"],
      symlinks: false
    }
    //entry: ['babel-polyfill', './src/main.js'],
  },

  chainWebpack: config => {
    if (config.plugins.has("extract-css")) {
      const extractCSSPlugin = config.plugin("extract-css");
      (extractCSSPlugin && extractCSSPlugin).tap(() => [
        {
          filename: "[name].css",
          chunkFilename: "[name].css"
        }
      ]);
    }
  },

  lintOnSave: false
};