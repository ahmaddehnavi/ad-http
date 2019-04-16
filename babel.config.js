module.exports = {
    "plugins": [
        ["@babel/plugin-proposal-decorators", {"legacy": true}],
        ["@babel/plugin-proposal-class-properties", {"loose": true}],
        ["@babel/plugin-transform-modules-commonjs", {
            "strictMode": false
        }]
    ],
    "presets": [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        ['@babel/preset-typescript'],
        "@babel/preset-react",
    ]
};
