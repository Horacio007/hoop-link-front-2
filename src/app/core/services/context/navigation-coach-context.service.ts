import { Injectable } from '@angular/core';
import { CoachContext } from './types/coach-context.types';

@Injectable({
  providedIn: 'root'
})
export class NavigationCoachContextService {
  private currentContext: CoachContext = null;

  setContext(context: CoachContext) {
    this.currentContext = context;
  }

  getContext(): CoachContext {
    return this.currentContext;
  }

  isContextChange(newContext: CoachContext): boolean {
    return (
      this.currentContext !== null &&
      this.currentContext !== newContext
    );
  }

  clear() {
    this.currentContext = null;
  }
}
