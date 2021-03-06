const path = require('path');

const publicPath = path.join(__dirname, 'public');

module.exports = {
    entry: path.join(__dirname, 'public/app.jsx'),
    output: {
        path: publicPath,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.(js|jsx)$/,
                include: [publicPath], 
                use: 'babel-loader' 
            },
            {
                test: /\.(css|scss)$/,
                include: [publicPath],
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: publicPath
    }
}