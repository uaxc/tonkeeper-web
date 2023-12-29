import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
const webpack = require('webpack');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure'
    }),
    new webpack.EnvironmentPlugin(['REACT_APP_MEASUREMENT_ID', 'REACT_APP_GA_SECRET'])
];
