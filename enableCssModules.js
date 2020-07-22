module.exports = (config, env) => {
    require('fs').writeFileSync('webpack.json', JSON.stringify(env, null, 2))

    for (const rule of config.module.rules || []) {
        const uses = rule.use && (Array.isArray(rule.use) ? rule.use : [rule.use])

        for (const use of uses || []) {
            if (use.loader === 'css-loader') {
                use.options = { modules: true }
            }
        }
    }

    // config.optimization = { minimize: false }

    return config
}
