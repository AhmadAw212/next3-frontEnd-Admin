import { Injectable } from '@angular/core';

declare let alertify: any;

@Injectable({
  providedIn: 'root',
})
export class AlertifyService {
  constructor() {}
  confirm(message: string, okCallBack: () => any) {
    alertify.confirm(message, function (e: any) {
      if (e) {
        okCallBack();
      } else {
      }
    });
  }

  confirmDialog(
    message: string,
    okCallBack: () => any,
    header: string = 'Confirmation'
  ) {
    alertify
      .confirm()
      .setHeader(header)
      .setting({
        message: message,
        onok: okCallBack,
      })
      .show();
  }

  dialogAlert(message: string) {
    alertify
      .alert()
      .setHeader('Response')
      .setting({
        closable: true,
        message: message,
      })
      .show();
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }
  warning(message: string) {
    alertify.warning(message);
  }
  message(message: string) {
    alertify.message(message);
  }
}
