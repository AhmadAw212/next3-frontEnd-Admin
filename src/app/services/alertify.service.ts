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
  ConfirmationDialog(title: string, message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      alertify.confirm(
        title,
        message,
        () => resolve(true), // User clicked 'OK'
        () => resolve(false) // User clicked 'Cancel'
      );
    });
  }
  dialogAlert(message: string, title: string) {
    alertify
      .alert()
      .setHeader(title)
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
