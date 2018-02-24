import { SessionService } from './session.service';
import { CookieService } from 'ngx-cookie';
import { JwtService } from './jwt.service';
import {WindowService} from '../utils/window.service';

describe('SessionService', () => {

  const COOKIE_KEY = '__dm-viewer-token';
  const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
  const SESSION = {
    token: TOKEN
  };
  const DECODED_JWT = {
    'id': '0'
  };

  const BASE_TIME = new Date(2013, 9, 23, 0 , 0 , 0);
  const BASE_PLUS_8H = new Date(2013, 9, 23, 8 , 0 , 0);

  let sessionService: SessionService;

  let cookieService: any;
  let windowService: any;

  beforeEach(() => {
    cookieService = jasmine.createSpyObj<CookieService>('cookieService', [
      'getObject',
      'putObject',
      'remove'
    ]);
    windowService = jasmine.createSpyObj<WindowService>('windowService', [
      'reload'
    ]);
    sessionService = new SessionService(cookieService, windowService);
  });

  describe('createSession', () => {

    beforeEach(() => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should create a new session with provided object and 8 hours lifespan', () => {
      jasmine.clock().mockDate(BASE_TIME);

      sessionService.createSession(SESSION);

      expect(cookieService.putObject).toHaveBeenCalledWith(COOKIE_KEY, SESSION, {
        expires: BASE_PLUS_8H
      });
    });

  });

  describe('getSession', () => {
    it('should return null when no session created', () => {
      cookieService.getObject.and.returnValue(null);

      const session = sessionService.getSession();
      expect(session).toBeNull();
      expect(cookieService.getObject).toHaveBeenCalledWith(COOKIE_KEY);
    });

    it('should return session object when valid session', () => {
      cookieService.getObject.and.returnValue(SESSION);

      const session = sessionService.getSession();
      expect(session).toEqual(SESSION);
      expect(cookieService.getObject).toHaveBeenCalledWith(COOKIE_KEY);
    });
  });

  describe('getUID', () => {

    it('should be hardcoded to 0', () => {
      cookieService.getObject.and.returnValue(SESSION);
      spyOn(JwtService, 'decode').and.returnValue(DECODED_JWT);
      expect(sessionService.getUID()).toEqual('0');
    });

  });


  describe('clearSession', () => {
    it('should be clear the session', () => {
      sessionService.clearSession();

      expect(windowService.reload).toHaveBeenCalled();
      expect(cookieService.remove).toHaveBeenCalled();
    });

  });

});
