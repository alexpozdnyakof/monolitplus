const { resolve, join, path } = require('path'),
    env = process.env.NODE_ENV || 'development',
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CircularDependencyPlugin = require('circular-dependency-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

// const content = require('./src/scripts/content.ts');

// connect all postcss plugins //
const autoprefixer = require('autoprefixer'),
    postcssCustomProperties = require('postcss-custom-properties');
const PATHS = {
    src: join(__dirname, 'src'),
    dist: join(__dirname, 'dist')
};


const polyfills = [{
    from: resolve(`${webcomponentsjs}/webcomponents-bundle.js`),
    to: join(PATHS.dist, 'vendor'),
    flatten: true
}];
const HtmlWebpackPlugin = require('html-webpack-plugin');
// ---- dont handle dist remove after every build, it's automagically ---//
const CleanPlugin = require('clean-webpack-plugin');



module.exports = {
    entry: PATHS.src + '/scripts/index.ts',

    output: {
        path: PATHS.dist
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    module: {
        rules: [{
                test: /\.pug$/,
                exclude: ['/node_modules/'],
                use: [{
                    loader: 'pug-loader',
                    options: {
                        self: true
                    }
                }]
            },
            {
                test: /\.scss|css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'resolve-url-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    grid: true,
                                    browsers: ['ie >= 10', 'last 2 version']
                                }),
                                postcssCustomProperties({
                                    preserve: false
                                })
                            ],
                            sourceMap: true
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(ts|js)x?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: { ie: '11' } }]
                        ],
                        plugins: ['@babel/plugin-syntax-dynamic-import', 'dynamic-import-webpack']
                    }
                },
                exclude: /node_modules\/(?!(lit-html|@polymer)\/).*/
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                test: /\.(ttf|otf|eot)$/,
                use: [{
                    loader: 'file-loader?name=' + PATHS.src + '/assets/fonts/[name].[ext]',
                    options: {
                        outputPath: 'assets/fonts',
                    },
                }]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        mimetype: 'application/font-woff',
                        name: 'assets/fonts/[hash].[ext]'
                    }
                }]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'assets/images/[hash]-[name].[ext]'
                    }
                }]
            }

        ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    plugins: [
        new CleanPlugin(PATHS.dist),
        new UglifyJSPlugin(),
        new CircularDependencyPlugin({
            exclude: /a\.ts|node_modules/,
            failOnError: true,
            cwd: process.cwd()
        }),

        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new HtmlWebpackPlugin({
            template: PATHS.src + '/views/index.pug',
            filename: 'index.html',
            data: require(`${PATHS.src}/content/home.json`)
        }),
        new HtmlWebpackPlugin({
            template: PATHS.src + '/views/grid.pug',
            filename: 'grid.html',
        }),
        new HtmlWebpackPlugin({
            template: PATHS.src + '/views/typography.pug',
            filename: 'typography.html',
        }),
        new CopyWebpackPlugin([{
            from: `${PATHS.src}/favicon.ico`,
            to: 'favicon.ico'
        }]),
        new CopyWebpackPlugin(
            polyfills
        )
    ],

    mode: env,

    devServer: {
        contentBase: PATHS.dist,
        watchContentBase: true,
        https: true
    },

    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            name: false,

            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }
    }
};