// Global type declarations for external libraries and APIs

// Lord Icon Web Component
declare namespace JSX {
  interface IntrinsicElements {
    'lord-icon': {
      src?: string;
      trigger?: string;
      style?: React.CSSProperties;
      'aria-label'?: string;
      children?: React.ReactNode;
    };
  }
}

// Google Analytics gtag function
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        custom_parameters?: Record<string, any>;
        [key: string]: any;
      }
    ) => void;

    // Hotjar integration
    hj?: (command: string, ...args: any[]) => void;

    // Custom analytics
    analytics?: {
      track: (event: string, properties?: Record<string, any>) => void;
      [key: string]: any;
    };
  }

  // Global gtag function
  function gtag(
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: {
      event_category?: string;
      event_label?: string;
      value?: number;
      custom_parameters?: Record<string, any>;
      [key: string]: any;
    }
  ): void;
}

export {};
