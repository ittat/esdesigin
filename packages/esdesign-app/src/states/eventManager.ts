const logger = console

export type ACTION_TYPES =
    | 'canvas.element.focus'
    | 'canvas.element.deleted'
    | 'appdom.update'
    | 'component.props.update'
    | 'appdom.add.customComponents'
    | 'appdom.add.page'

export interface IEvent {
    readonly listeners: Map<ACTION_TYPES, Set<Function>>,
    readonly eventHandlers: Map<ACTION_TYPES, Function>
    addListener(action_name: ACTION_TYPES, listener: Function): void,
    removeListener(action_name: ACTION_TYPES, listener: Function): void,
    dispatch(action_name: ACTION_TYPES, data: any): void
}

export class EventManager implements IEvent {
    readonly listeners: Map<ACTION_TYPES, Set<Function>>;
    readonly eventHandlers: Map<ACTION_TYPES, Function>;

    constructor() {
        this.listeners = new Map();
        this.eventHandlers = new Map();
    }

    addListener(action_name: ACTION_TYPES, listener: Function) {
        if (!this.listeners.has(action_name)) {
            this.listeners.set(action_name, new Set([listener]));
        } else {
            let listeners = this.listeners.get(action_name);
            listeners!.add(listener);
        }
    }

    removeListener(action_name: ACTION_TYPES, listener: Function) {
        if (!this.listeners.has(action_name)) {
            return;
        }

        let listeners = this.listeners.get(action_name);
        if (listeners!.has(listener)) {
            listeners!.delete(listener);
        }
    }

    dispatch(action_name: ACTION_TYPES, data: any) {
        logger.log(`dispatch ${action_name}`);

        // dispatch the even data to all listeners for this action.
        if (!this.listeners.has(action_name)) {
            logger.warn(`No listeners for ${action_name}`);
            return;
        }

        this.listeners.get(action_name)!.forEach(listener => {
            listener(action_name, data);
        });
    }

}
