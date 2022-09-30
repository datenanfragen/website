export function rethrow(
    error: GenericException,
    description?: string,
    context?: Record<string, unknown>,
    enduser_message?: string,
    catchable = false
) {
    if (description) error.description = description;
    if (context) error.context = context;
    if (enduser_message) error.enduser_message = enduser_message;

    // Allow throwing from inside promise `catch` functions, see https://stackoverflow.com/a/30741722.
    if (catchable) throw error;
    else
        setTimeout(() => {
            throw error;
        }, 0);
}

class GenericException extends Error {
    code = -1;
    description?: string;
    context?: Record<string, unknown>;
    enduser_message?: string;

    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message);
        this.name = 'Exception';
        this.message = message || '';
        this.context = context;
        this.enduser_message = enduser_message || '';
    }

    static fromError(error: Error) {
        return Object.assign(new this(''), error);
    }

    toString() {
        return `${this.name}: ${this.message}`;
    }
}

/*
 * These exception classes are to be interpreted as explained in RFC 5424.
 * By default, errors and above are shown to the user.
 */

export class EmergencyException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Emergency';
        this.code = 0;
    }
}

export class AlertException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Alert';
        this.code = 1;
    }
}

export class CriticalException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Critical';
        this.code = 2;
    }
}

export class ErrorException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Error';
        this.code = 3;
    }
}

export class WarningException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Warning';
        this.code = 4;
    }
}

export class NoticeException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Notice';
        this.code = 5;
    }
}

export class InformationalException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Informational';
        this.code = 6;
    }
}

export class DebugException extends GenericException {
    constructor(message: string, context?: Record<string, unknown>, enduser_message?: string) {
        super(message, context, enduser_message);
        this.name = 'Debug';
        this.code = 7;
    }
}
