export {};

declare global {
  interface Window {
    ddClient: import('@docker/extension-api-client-types/dist/v1').DockerDesktopClient
  }
}