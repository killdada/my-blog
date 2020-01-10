module.exports = {
    root: true,
    env: {
        browser: true
    },
    extends: ['airbnb-base'],
    // required to lint *.vue files
    // plugins: ['vue'],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        semi: ['error', 'never'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'space-before-function-paren': 0,
        'linebreak-style': [0, 'error', 'windows'],
        'comma-dangle': 0,
        'object-curly-newline': [
            'error',
            {
                //
                ImportDeclaration: 'never',
                ObjectExpression: { multiline: true, minProperties: 1 },
                ObjectPattern: { multiline: true }
            }
        ],
        'no-param-reassign': [
            'error',
            {
                // 禁止对函数参数再赋值
                props: false
            }
        ],
        'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }], // 强制操作符使用一致的换行符风格
        'no-unused-expressions': [
            'error',
            {
                allowTernary: true,
                allowShortCircuit: true,
                allowTaggedTemplates: true
            }
        ], // 禁止未使用过的表达式,allowTernary 设置为 true 将允许你在表达式中使用类似逻辑短路求值的三元运算符
        'no-underscore-dangle': [
            'error',
            {
                enforceInMethodNames: false,
                allowAfterThis: true,
                allowAfterSuper: true,
                allow: ['_getBroadCastList']
            }
        ], // 禁止标识符中有悬空下划线,"allowAfterThis": false (默认) 禁止在 this 对象的成员变量上使用悬空下划线, "enforceInMethodNames": false (默认) 允许在方法名中使用悬空下划线,
        'global-require': 0, // 允许全局使用require
        'arrow-parens': ['error', 'as-needed'], // 箭头函数体只有一个参数时，可以省略圆括号。
        'arrow-body-style': 0, // 箭头函数体总是使用大括号,可以不使用
        'no-multi-assign': 0, // 允许连续赋值
        'no-param-reassign': 0, // 允许对函数参数再赋值
        'no-underscore-dangle': 0, // 允许使用_
        'import/prefer-default-export': 0,
        'import/no-unresolved': 0,
        'import/no-extraneous-dependencies': 0, // 禁止导入未在package.json的依赖项
        'import/no-dynamic-require': 0, // 禁止使用require表达式
        'max-len': [
            'error',
            {
                code: 500,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreComments: true
            }
        ],
        camelcase: 0,
        'object-curly-newline': 0,
        'prefer-promise-reject-errors': 0,
        'no-plusplus': 0
    }
}
