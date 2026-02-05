import Swal from 'sweetalert2';

// Get current theme
const getTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

// Custom SweetAlert2 configuration
const customSwal = Swal.mixin({
  customClass: {
    popup: 'swal-popup',
    title: 'swal-title',
    htmlContainer: 'swal-text',
    confirmButton: 'swal-confirm-button',
    cancelButton: 'swal-cancel-button',
    denyButton: 'swal-deny-button',
  },
  buttonsStyling: false,
});

// Success alert
export const showSuccess = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Entendido',
    timer: 3000,
    timerProgressBar: true,
  });
};

// Error alert
export const showError = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
  });
};

// Warning alert
export const showWarning = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Entendido',
  });
};

// Info alert
export const showInfo = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'Entendido',
  });
};

// Confirmation dialog
export const showConfirm = (title: string, text?: string, confirmText = 'Sí', cancelText = 'No') => {
  return customSwal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
};

// Delete confirmation (WITHOUT input field) - CLEAN APPROACH
export const showDeleteConfirm = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'swal-popup swal-delete-confirm',
      title: 'swal-title',
      htmlContainer: 'swal-text',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
    },
    allowEnterKey: true,
    allowEscapeKey: true,
    allowOutsideClick: true,
    focusConfirm: false,
    focusCancel: true,
    showLoaderOnConfirm: false,
  });
};

// Toast notification (small, auto-dismiss)
export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal-toast',
    },
  });
};

// Loading alert
export const showLoading = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close any open alert
export const closeAlert = () => {
  Swal.close();
};

export default customSwal;
