// Development logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

export const devLog = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const devWarn = (...args) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const devError = (...args) => {
  if (isDevelopment) {
    console.error(...args);
  }
};

// Group logging for better debugging
export const devGroup = (title, callback) => {
  if (isDevelopment) {
    console.group(title);
    callback();
    console.groupEnd();
  }
}; 