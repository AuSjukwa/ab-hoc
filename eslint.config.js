import antfu from '@antfu/eslint-config';

export default antfu({
    stylistic: {
        indent: 4,
        semi: true,
    },

    vue: true,
    react: true,
    yaml: false,
});
