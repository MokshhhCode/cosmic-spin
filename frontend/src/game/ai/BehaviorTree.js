// Core Behavior Tree Classes

export class Node {
    constructor() {
        this.status = 'ready'; // ready, running, success, failure
    }

    tick(blackboard) {
        // Override me
        return 'success';
    }
}

export class Composite extends Node {
    constructor(children = []) {
        super();
        this.children = children;
    }
}

export class Selector extends Composite {
    // Runs children until one succeeds
    tick(blackboard) {
        for (const child of this.children) {
            const status = child.tick(blackboard);
            if (status !== 'failure') {
                return status;
            }
        }
        return 'failure';
    }
}

export class Sequence extends Composite {
    // Runs children until one fails
    tick(blackboard) {
        for (const child of this.children) {
            const status = child.tick(blackboard);
            if (status !== 'success') {
                return status;
            }
        }
        return 'success';
    }
}

export class Decorator extends Node {
    constructor(child) {
        super();
        this.child = child;
    }
}

// Leaf Nodes (Actions/Conditions)
export class Action extends Node {
    constructor(actionFn) {
        super();
        this.actionFn = actionFn;
    }

    tick(blackboard) {
        return this.actionFn(blackboard);
    }
}

export class Condition extends Node {
    constructor(conditionFn) {
        super();
        this.conditionFn = conditionFn;
    }

    tick(blackboard) {
        return this.conditionFn(blackboard) ? 'success' : 'failure';
    }
}
