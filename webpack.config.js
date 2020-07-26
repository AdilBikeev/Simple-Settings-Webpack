const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].$ ext`

const jsLoaders = () => {
    const loaders = [{
        loader:  'babel-loader', // плагин, для кроссбраузерности
        options: babelOptions()
    }]

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders
}

const babelOptions = presets => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if(presets) {
        opts.presets.push(presets);
    }

    return opts;
}

const optimization = () => {
    const config = { // методы для оптимизации веб-приложения
        splitChunks: { // перечисленные чанки соединяет воедино, чтобы каждый раз один и тот же файл не подгружать
            chunks: 'all'
        }
    }

    if (!isDev)
    {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill' , './index.jsx'],
        analitics: './analitics.ts'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({ // задает файл, который будет использоваться в качестве шаблона
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev // оптимизиурет html файлы, убирая в них отступы
            }
        }),
        new CleanWebpackPlugin(), // позволяет не плодить файлы с разными хэшами, а перезатирать их
        new CopyWebpackPlugin({ // правила автокопирования файлов
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    optimization: optimization(),
    devServer: { // настройки для сервера, который будет сам обновлять страницу, при её изменении
        port: 4200, // порт на котором будет оно запускаться
        hot: isDev
    },
    module: {
        rules: [ //список loaders
            {
                test: /\.(less|css)$/, // добавляем правило, по которому будут добавляться стили к сайту
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev, //изменение сущностей без перезагрузки страницы
                            reloadAll: true
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, // исключаем обработку файлов из папки "node_modules" данных loader
                use: jsLoaders()
            },
            { 
                test: /\.ts$/, 
                exclude: /node_modules/, // исключаем обработку файлов из папки "node_modules" данных loader
                loader: {
                    loader: "babel-loader" , // плагин, для кроссбраузерности
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            { 
                test: /\.jsx$/, 
                exclude: /node_modules/, // исключаем обработку файлов из папки "node_modules" данных loader
                loader: {
                    loader: "babel-loader" , // плагин, для кроссбраузерности
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}