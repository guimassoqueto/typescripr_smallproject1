import PATH from 'path';

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: PATH.resolve(__dirname, 'dist')
    }
}