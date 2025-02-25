/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The Backstage plugin that helps you create new things
 *
 * @packageDocumentation
 */

export { scaffolderApiRef, ScaffolderClient } from './api';
export type {
  ListActionsResponse,
  LogEvent,
  ScaffolderApi,
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
  ScaffolderGetIntegrationsListOptions,
  ScaffolderGetIntegrationsListResponse,
  ScaffolderOutputLink,
  ScaffolderScaffoldOptions,
  ScaffolderScaffoldResponse,
  ScaffolderStreamLogsOptions,
  ScaffolderTask,
  ScaffolderTaskOutput,
  ScaffolderTaskStatus,
  TemplateParameterSchema,
} from './types';
export {
  createScaffolderFieldExtension,
  ScaffolderFieldExtensions,
} from './extensions';
export type {
  CustomFieldExtensionSchema,
  CustomFieldValidator,
  FieldExtensionOptions,
  FieldExtensionComponentProps,
  FieldExtensionComponent,
} from './extensions';
export { createScaffolderLayout, ScaffolderLayouts } from './layouts';
export type { LayoutOptions, LayoutTemplate, LayoutComponent } from './layouts';
export {
  EntityPickerFieldExtension,
  EntityNamePickerFieldExtension,
  EntityTagsPickerFieldExtension,
  OwnerPickerFieldExtension,
  OwnedEntityPickerFieldExtension,
  RepoUrlPickerFieldExtension,
  ScaffolderPage,
  scaffolderPlugin,
} from './plugin';
export * from './components';
export {
  rootRouteRef,
  nextRouteRef,
  selectedTemplateRouteRef,
  nextSelectedTemplateRouteRef,
} from './routes';
export type { TaskPageProps } from './components/TaskPage';

/** next exports */
export { NextScaffolderPage } from './plugin';
export type { NextRouterProps } from './next';
export type { TemplateGroupFilter } from './next';
export type { FormProps } from './next';
export {
  createNextScaffolderFieldExtension,
  type NextCustomFieldValidator,
  type NextFieldExtensionOptions,
  type NextFieldExtensionComponentProps,
} from './extensions';
