import type APIWrapper from 'src/main';

declare global {
  interface Window {
    SWAGTHEME: string;
    SWAGAPI: APIWrapper;
  }
}

export type Emitter = {
	on(event: string, listener: (...arguments_: any[]) => void): Emitter;
	once(event: string, listener: (...arguments_: any[]) => void): Emitter;
	off(event: string, listener: (...arguments_: any[]) => void): Emitter;
	off(): Emitter;
	emit(event: string, ...arguments_: any[]): Emitter;
	listeners(event: string): Array<(...arguments_: any[]) => void>;
	listenerCount(event: string): number;
	listenerCount(): number;
	hasListeners(): boolean;
};

type EmitterConstructor = {
	prototype: Emitter;
	new (object?: object): Emitter;
	<T extends object>(object: T): T & Emitter;
};

declare const emitter: EmitterConstructor;

export default emitter;
