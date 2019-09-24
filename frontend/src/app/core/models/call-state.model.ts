export const enum LoadingState {
  LOADING = 'LOADING',
  LOADED = 'LOADED'
}

export interface ErrorState {
  errorMessage: string;
}

export type CallState = LoadingState | ErrorState;

export function getErrorMessage(callState: CallState): string | null {
  if ((callState as ErrorState).errorMessage !== undefined) {
      return (callState as ErrorState).errorMessage;
  }
  return null;
}

