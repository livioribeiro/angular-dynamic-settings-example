interface Environment {
  production: boolean;
  api: string;
}

export const environment = (window as any).$environment as Environment;
