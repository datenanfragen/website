module.exports = {
    // This is duplicated from letter-generator as we need to introduce another flag value. We now support the following
    // ones:
    //   * 0: don't include the flag content
    //   * 1: include the flag content
    //   * 2: include the flag content in square brackets
    templatify: (template, flags, variables) => {
        let result = template;
        for (const flag in flags) {
            result = result.replace(
                new RegExp('\\[' + flag + '>([\\s\\S]*?)\\]', 'gmu'),
                flags[flag] === 1 ? '$1' : flags[flag] === 2 ? '[$1]' : ''
            );
        }
        for (const variable in variables) {
            result = result.replace('{' + variable + '}', variables[variable]);
        }
        return result.replace(/<.+?>/gmu, '');
    },
    mm2pt: (mm) => (72.0 / 25.4) * mm,
};
