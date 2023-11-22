/// <reference types="node" />
import type { Server } from 'http';
export declare function mockServer(data: Record<string | number | symbol, string | boolean>): Promise<Server>;
