export function rethrow(error, description, context) {
    // allow throwing from inside promise `catch` functions, see https://stackoverflow.com/a/30741722
    setTimeout(() => {
        error.description = description;
        error.context = context;
        throw error;
    }, 0);
}

class GenericException extends Error {
    constructor(message, context) {
        super(message);
        this.name = 'Exception';
        this.message = message;
        this.context = context;
    }

    static fromError(error) {
        return Object.assign(error, new this());
    }

    toString() {
        return this.name + ': ' + this.message;
    }
}

/*
 * These exception classes are to be interpreted as explained in RFC 5424.
 * By default, errors and above are shown to the user.
 */

export class EmergencyException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Emergency';
        this.code = 0;
    }
}

export class AlertException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Alert';
        this.code = 1;
    }
}

export class CriticalException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Critical';
        this.code = 2;
    }
}

export class ErrorException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Error';
        this.code = 3;
    }
}

export class WarningException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Warning';
        this.code = 4;
    }
}

export class NoticeException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Notice';
        this.code = 5;
    }
}

export class InformationalException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Informational';
        this.code = 6;
    }
}

export class DebugException extends GenericException {
    constructor(message, context) {
        super(message, context);
        this.name = 'Debug';
        this.code = 7;
    }
}
