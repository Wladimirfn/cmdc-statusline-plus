// Local type declarations for the Command Code mod API.
// Why not a dependency: the ModApi types live in no published package — `@commandcode/harness`
// is not published, and the `command-code` package ships no .d.ts (dist only has build output
// and docs). This declaration is hand-written against the product docs
// dist/bundled/mod-builder/reference/{api,ui,hooks-and-events}.md and exists purely so
// `tsc --noEmit` can check this mod; when the host API changes, the docs are authoritative.
// It takes no part at runtime: `import type` is erased entirely by Node's type stripping, so
// this file is never resolved.

export interface Disposable {
	dispose(): void;
}

export interface ModUiSelectOption {
	label: string;
	description?: string;
}

// Documented contract (ui.md): in the TUI, select/input/confirm are real modals; headless,
// confirm -> false and select/input -> undefined, and nothing is ever auto-approved.
export interface ModUi {
	// Optional is truthful, not defensive: ModUi in 1.9.0 really does not have this property
	// (setStatus was a no-op in that version) — it arrived in 1.10.0. It is exactly the
	// dependency MIN_HOST_VERSION guards, and the reason the floor is 1.10.0. Declaring it
	// required would let a call site be written that provably throws on an old host.
	capabilities?: {status: boolean};
	setStatus(text: string | null): Disposable;
	notify(message: string, level?: 'info' | 'warning' | 'error' | string): void;
	confirm(options: {title: string; message?: string}): Promise<boolean>;
	select(options: {
		title: string;
		options: readonly ModUiSelectOption[];
	}): Promise<string | undefined>;
	input(options: {title: string; placeholder?: string}): Promise<string | undefined>;
}

// onSessionStart receives {source: 'startup' | 'resume', ...}; onSessionEnd receives
// {reason: 'shutdown' | 'replaced'} (api.md): 'replaced' means the host is swapping sessions
// within the same process.
export interface ModHooks {
	onSessionStart?: (info: {source?: string; sessionId?: string}) => void;
	onSessionEnd?: (info: {reason?: string}) => void;
	[key: string]: unknown;
}

export interface ModCommandContext {
	args?: unknown;
	ui?: ModUi;
	cwd?: string;
	exec?: ModApi['exec'];
}

export interface ModCommand {
	name: string;
	description?: string;
	argumentHint?: string;
	handler: (context: ModCommandContext) => unknown;
}

export interface ModExecResult {
	stdout: string;
	stderr: string;
	code: number;
}

export interface ModApi {
	name: string;
	cwd: string;
	ui: ModUi;
	hooks(hooks: ModHooks): Disposable;
	addFlag(
		name: string,
		spec: {type: 'boolean' | 'string'; default?: boolean | string; description?: string},
	): Disposable;
	getFlag(name: string): boolean | string | undefined;
	on(event: string, handler: (event: unknown) => void): Disposable;
	addCommand(command: ModCommand): Disposable;
	exec(options: {
		command: string;
		args?: string[];
		cwd?: string;
		signal?: AbortSignal;
	}): Promise<ModExecResult>;
}
