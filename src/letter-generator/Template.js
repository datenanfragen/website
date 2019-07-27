export default class Template {
    constructor(template, flags, variables) {
        [this.template, this.flags, this.variables] = [template, flags, variables];
    }

    getText() {
        return Template.handleTemplate(this.template, this.flags, this.variables);
    }

    static handleTemplate(template, flags, variables) {
        for (let flag in flags) {
            template = template.replace(new RegExp('\\[' + flag + '>([\\s\\S]*?)\\]', 'gmu'), flags[flag] ? '$1' : '');
        }
        for (let variable in variables) {
            template = template.replace('{' + variable + '}', variables[variable]);
        }
        return template;
    }
}
