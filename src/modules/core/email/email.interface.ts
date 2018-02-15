
export interface IMailinData {
  to: { [email: string]: string };
  subject: string;
  from: string[];
  html: string;
  text?: string;
  cc?: { [email: string]: string };
  bcc?: { [email: string]: string };
  replyto?: { [email: string]: string };
  attachment?: string[];
  headers?: { [header: string]: string };
  inline_images?: { [fileName: string]: string };
}

export interface IMailinSendEmailResponse {
  code: 'success' | 'failed';
  message: string;
  data: any;
}
