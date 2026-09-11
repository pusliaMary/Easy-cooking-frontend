import { toast as toastify } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

export type CustomToastOptions = Pick<ToastOptions, 'toastId'>;

export const toast = {
  success: (message: string, options?: CustomToastOptions) => 
    toastify.success(message, options),
    
  error: (message: string, options?: CustomToastOptions) => 
    toastify.error(message, options),
    
  info: (message: string, options?: CustomToastOptions) => 
    toastify.info(message, options),
};
