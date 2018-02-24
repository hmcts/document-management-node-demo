import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SessionService } from './session.service';
import { WindowService } from '../utils/window.service';
import { DocumentService } from '../utils/document.service';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable()
export class IdamGuard implements CanActivate {

  public static readonly TOKEN_PARAM = 'jwt';

  constructor(
    private appConfig: AppConfig,
    private windowService: WindowService,
    private documentService: DocumentService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const myQueryParams: { [details: string]: string; } = {};
    let session: any;

    if (activatedRouteSnapshot.queryParams && activatedRouteSnapshot.queryParams[IdamGuard.TOKEN_PARAM]) {
      const tokenValue = activatedRouteSnapshot.queryParams[IdamGuard.TOKEN_PARAM];
      try {
        JwtService.decode(tokenValue);
        session = {
          token: tokenValue
        };
        this.sessionService.createSession(session);
        for (const param of Object.keys(activatedRouteSnapshot.queryParams)) {
          if (param !== IdamGuard.TOKEN_PARAM) {
            myQueryParams[param] = activatedRouteSnapshot.queryParams[param];
          }
        }
        this.router.navigate(['/'], {
          queryParams:  myQueryParams
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      session = this.sessionService.getSession();
    }
    if (!session) {
      const idamUrl = this.appConfig.getLoginUrl();
      this.windowService.locationAssign(idamUrl + '?continue-url=' + encodeURIComponent(this.documentService.getUrl()));
      return false;
    }
    return true;
  }
}
