module.exports = {
    presets: [
        ['@vue/app', {
            useBuiltIns: 'entry' // src全局es5编译
        }]
    ],
    plugins: [
        [
            'import',
            {libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true}
        ]
    ]
}
