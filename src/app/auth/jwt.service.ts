import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class JwtService {

  static decode(authToken: object): string {
    return jwtDecode(authToken);
  }

}
