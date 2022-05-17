// Generated using webpack-cli https://github.com/webpack/webpack-cli
const PATH = require('path');
const Clean = require('clean-webpack-plugin');

const CONFIG = {
    entry: './typescript/app.ts',
    output: {
        filename: 'bundle.js',
        path: PATH.resolve(__dirname, 'dist'),
    },
    devtool: 'hidden-source-map', 
    devServer: {
        open: true,
        host: 'localhost',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new Clean.CleanWebpackPlugin()
    ],
    mode: 'production', // use 'development' for development
};

module.exports = CONFIG;
