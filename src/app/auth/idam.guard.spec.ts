import { IdamGuard } from './idam.guard';
import { ActivatedRouteSnapshot } from '@angular/router';
import { SessionService } from './session.service';
import { WindowService } from '../utils/window.service';
import { DocumentService } from '../utils/document.service';
import { AppConfig } from '../app.config';

describe('IdamGuard', () => {

  let JWT_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJxMHF2Ymx2OTAyczJ2czNwcTZtMTk5bDM1dSIsInN1YiI6IjI0MiIsImlhdCI6MTUw';
  JWT_TOKEN += 'NTE0MjM0NCwiZXhwIjoxNTA1MTcxMTQ0LCJkYXRhIjoiY2FzZXdvcmtlcixjYXNld29ya2VyLXByb2JhdGUsY2FzZXdvcmtlci1j';
  JWT_TOKEN += 'bWMsY2FzZXdvcmtlci1zc2NzLGNhc2V3b3JrZXItZGl2b3JjZSxjYXNld29ya2VyLWxvYTEsY2FzZXdvcmtlci1wcm9iYXRlLWxv';
  JWT_TOKEN += 'YTEsY2FzZXdvcmtlci1jbWMtbG9hMSxjYXNld29ya2VyLXNzY3MtbG9hMSxjYXNld29ya2VyLWRpdm9yY2UtbG9hMSIsInR5cGUi';
  JWT_TOKEN += 'OiJBQ0NFU1MiLCJpZCI6IjI0MiIsImZvcmVuYW1lIjoibmF5YWIiLCJzdXJuYW1lIjoiZ3VsIiwiZGVmYXVsdC1zZXJ2aWNlIjoi';
  JWT_TOKEN += 'Q0NEIiwibG9hIjoxLCJkZWZhdWx0LXVybCI6Imh0dHBzOi8vcmVnaXN0cmF0aW9uLmRldi5jY2lkYW0ucmVmb3JtLmhtY3RzLm5l';
  JWT_TOKEN += 'dC9yZWdpc3Rlci11c2VyIiwiZ3JvdXAiOiJjY2QtYWRtaW4iLCJjcmVhdGVzR3JvdXAiOiJDYXNlIFdvcmtlciJ9.Acd4fq37RQ8';
  JWT_TOKEN += 'gb2QF_qOA5ZvE17tEsi2W2YKr5Y9SdhI';
  const SESSION = {
    token: JWT_TOKEN
  };
  const CURRENT_URL = 'http://core-case-data.common-components.reform';
  const CURRENT_URL_ENCODED = 'http%3A%2F%2Fcore-case-data.common-components.reform';
  const LOGIN_URL = 'http://localhost:8000/login';

  let guard: IdamGuard;

  let appConfig: any;
  let sessionService: any;
  let windowService: any;
  let documentService: any;
  let routeService: any;

  let route: ActivatedRouteSnapshot;
  let routeSpy: any;

  beforeEach(() => {
    appConfig = jasmine.createSpyObj<AppConfig>('appConfig', ['getLoginUrl']);
    windowService = jasmine.createSpyObj<WindowService>('windowService', ['locationAssign']);
    documentService = jasmine.createSpyObj<DocumentService>('documentService', ['getUrl']);
    sessionService = jasmine.createSpyObj<SessionService>('sessionService', [
      'createSession',
      'getSession'
    ]);
    routeService = jasmine.createSpyObj<AppConfig>('routeService', ['navigate']);
    routeSpy = jasmine.createSpyObj<AppConfig>('routeSpy', ['queryParams']);

    guard = new IdamGuard(appConfig, windowService, documentService, sessionService, routeService);

    route = new ActivatedRouteSnapshot();
  });

  describe('canActivate', () => {
    it('should create session when JWT token in URL', () => {

      routeSpy.queryParams = {
        jwt: JWT_TOKEN
      };
      routeSpy.firstChild = {
        url: ['create', 'case']
      };
      guard.canActivate(routeSpy);

      expect(sessionService.createSession).toHaveBeenCalledWith({
        token: JWT_TOKEN
      });
    });

    it('should create eliminate JWT token in URL', () => {

      routeSpy.queryParams = {
        jwt: JWT_TOKEN,
        param1: 'P1',
        param2: 'P2'
      };
      const filteredQueryParams = {
        queryParams: {
          param1: 'P1',
          param2: 'P2'
        }
      };
      routeSpy.firstChild = {
        url: ['create', 'case']
      };
      guard.canActivate(routeSpy);

      expect(routeService.navigate).toHaveBeenCalledWith(['/'], filteredQueryParams);
    });

    it('should proceed to route when session active', () => {
      sessionService.getSession.and.returnValue(SESSION);

      const canActivate = guard.canActivate(route);

      expect(canActivate).toBeTruthy();
      expect(sessionService.getSession).toHaveBeenCalled();
    });

    it('should redirect to IDAM when NO session active', () => {
      documentService.getUrl.and.returnValue(CURRENT_URL);
      sessionService.getSession.and.returnValue(null);
      appConfig.getLoginUrl.and.returnValue(LOGIN_URL);

      const canActivate = guard.canActivate(route);

      expect(canActivate).toBeFalsy();
      expect(sessionService.getSession).toHaveBeenCalled();
      expect(documentService.getUrl).toHaveBeenCalled();
      expect(windowService.locationAssign).toHaveBeenCalledWith('http://localhost:8000/login?continue-url=' + CURRENT_URL_ENCODED);
    });
  });
});
